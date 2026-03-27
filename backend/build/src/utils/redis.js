"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = void 0;
const redis_1 = require("redis");
const config_1 = require("../config");
const redisClient = (0, redis_1.createClient)({ url: config_1.config.REDIS_URL });
redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('connect', () => console.log('Redis connected'));
const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};
exports.connectRedis = connectRedis;
exports.default = redisClient;
//# sourceMappingURL=redis.js.map