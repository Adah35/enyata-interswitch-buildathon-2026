import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { addDays, addMinutes } from 'date-fns';
import { AppDataSource, getRepository } from '../connection/data-source';
import { config } from '../config';
import { BaseService } from './service';
import { Repository } from 'typeorm';
import { BadRequestException, UnauthorizedError, NotFoundException } from '../errors/errors';
import { User } from '../entities/User.entity';
import { RefreshToken } from '../entities/RefreshToken.entity';
import { UserRole, KycLevel } from '../entities/enums';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface UserDTO {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  kycLevel: KycLevel;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  bio: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserInput {
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
}

export class UserService extends BaseService<User> {
  initRepository(): Repository<User> {
    return getRepository(User);
  }

  private get refreshTokenRepo(): Repository<RefreshToken> {
    return AppDataSource.getRepository(RefreshToken);
  }

  // ─── JWT helpers ─────────────────────────────────────────────────────────

  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.JWT_ACCESS_SECRET) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.JWT_REFRESH_SECRET) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  // Keep legacy alias used by existing authMiddleware
  generateJWT = (payload: { id: string; email: string }, expiresIn: string | number = '15m') => {
    return jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn } as jwt.SignOptions);
  };

  verifyToken = (token: string, isRefresh = false): JwtPayload | null => {
    try {
      const secret = isRefresh ? config.JWT_REFRESH_SECRET : config.JWT_ACCESS_SECRET;
      return jwt.verify(token, secret) as JwtPayload;
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }
  };

  // ─── Password helpers ─────────────────────────────────────────────────────

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  comparePassword(plain: string, hash: string): boolean {
    return bcrypt.compareSync(plain, hash);
  }

  // ─── DTO mapper ──────────────────────────────────────────────────────────

  toDTO(user: User): UserDTO {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      kycLevel: user.kycLevel,
      isPhoneVerified: user.isPhoneVerified,
      isEmailVerified: user.isEmailVerified,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }

  // ─── Auth operations ──────────────────────────────────────────────────────

  async registerUser(data: RegisterInput): Promise<{
    user: UserDTO;
    accessToken: string;
    refreshToken: string;
  }> {
    const repo = this.getRepository();

    const existing = await repo.findOne({
      where: [{ email: data.email }, { phone: data.phone }],
    });
    if (existing) {
      if (existing.email === data.email) {
        throw new BadRequestException('An account with this email already exists');
      }
      throw new BadRequestException('An account with this phone number already exists');
    }

    const user = repo.create({
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      password: this.hashPassword(data.password),
      role: data.role,
    });

    await repo.save(user);

    const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.generateAccessToken(payload);
    const refreshTokenValue = this.generateRefreshToken(payload);

    await this.storeRefreshToken(user.id, refreshTokenValue);

    return { user: this.toDTO(user), accessToken, refreshToken: refreshTokenValue };
  }

  async loginUser(email: string, password: string): Promise<{
    user: UserDTO;
    accessToken: string;
    refreshToken: string;
  }> {
    const repo = this.getRepository();

    const user = await repo.findOne({ where: { email: email.toLowerCase() } });
    if (!user || !this.comparePassword(password, user.password)) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login
    await repo.update(user.id, { lastLoginAt: new Date() });
    user.lastLoginAt = new Date();

    const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.generateAccessToken(payload);
    const refreshTokenValue = this.generateRefreshToken(payload);

    await this.storeRefreshToken(user.id, refreshTokenValue);

    return { user: this.toDTO(user), accessToken, refreshToken: refreshTokenValue };
  }

  async refreshAccessToken(tokenValue: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const decoded = this.verifyRefreshToken(tokenValue);

    const storedToken = await this.refreshTokenRepo.findOne({
      where: { token: tokenValue },
    });

    if (!storedToken) {
      throw new UnauthorizedError('Refresh token not found or already revoked');
    }

    if (storedToken.expiresAt < new Date()) {
      await this.refreshTokenRepo.delete({ token: tokenValue });
      throw new UnauthorizedError('Refresh token expired, please login again');
    }

    const user = await this.getRepository().findOne({ where: { id: decoded.id } });
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Rotate refresh token
    await this.refreshTokenRepo.delete({ token: tokenValue });

    const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
    const newAccessToken = this.generateAccessToken(payload);
    const newRefreshToken = this.generateRefreshToken(payload);

    await this.storeRefreshToken(user.id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(tokenValue: string): Promise<void> {
    if (tokenValue) {
      await this.refreshTokenRepo.delete({ token: tokenValue });
    }
  }

  async markPhoneVerified(userId: string): Promise<void> {
    await this.getRepository().update(userId, { isPhoneVerified: true });
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.getRepository().findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(userId: string, data: UpdateUserInput): Promise<UserDTO> {
    await this.getRepository().update(userId, data);
    const user = await this.getUser(userId);
    return this.toDTO(user);
  }

  // ─── Internal helpers ─────────────────────────────────────────────────────

  private async storeRefreshToken(userId: string, tokenValue: string): Promise<void> {
    const expiresAt = addDays(new Date(), 30);
    const rt = this.refreshTokenRepo.create({ userId, token: tokenValue, expiresAt });
    await this.refreshTokenRepo.save(rt);
  }
}