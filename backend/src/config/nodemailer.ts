import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { config } from ".";

export const nodemailerTransporter = nodemailer.createTransport(
  {
    host: config.EMAIL_HOST,
    port: Number(config.EMAIL_PORT),
    secure: config.EMAIL_SECURE === "true",
    auth: {
      user: config.EMAIL_USERNAME,
      pass: config.EMAIL_PASSWORD,
    },
  } as SMTPTransport.Options
);
