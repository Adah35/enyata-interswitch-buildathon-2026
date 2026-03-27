"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepository = exports.AppDataSource = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: false,
    entities: [`${__dirname}/../entities/**/*.{ts,js}`],
    migrations: [`${__dirname}/../migration/*.{ts,js}`],
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
});
const getRepository = (target) => {
    const repository = exports.AppDataSource.getRepository(target);
    return repository;
};
exports.getRepository = getRepository;
//# sourceMappingURL=data-source.js.map