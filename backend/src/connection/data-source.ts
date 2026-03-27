import { config } from "dotenv";
config();

import { DataSource, EntityTarget, Repository } from "typeorm"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT) ,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: false,
  entities: [`${__dirname}/../entities/**/*.{ts,js}`],
  migrations: [`${__dirname}/../migration/*.{ts,js}`],
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
})

export const getRepository = <Entity>(
    target: EntityTarget<Entity>
  ): Repository<Entity> => {
    const repository = AppDataSource.getRepository(target);
    return repository;
  };