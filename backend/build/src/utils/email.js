"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMassEmail = exports.sendEmail = void 0;
// import path from "path";
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = require("../config");
mail_1.default.setApiKey(config_1.config.SENDGRID_API_KEY || " ");
const sendEmail = async (email, subject, message) => {
    // Path to your logo (make sure it exists in your build)
    // const logoPath = path.join(__dirname, "../assets/logo.png");
    // const logoContent = fs.readFileSync(logoPath).toString("base64");
    const msg = {
        to: email,
        name: " Support",
        from: "",
        subject,
        html: message, // should contain <img src="cid:ibuamLogo" />
        // attachments: [
        //   {
        //     content: logoContent,
        //     filename: "logo.png",
        //     type: "image/png",
        //     disposition: "inline",
        //     content_id: "ibuamLogo", // must match src="cid:ibuamLogo"
        //   },
        // ],
    };
    try {
        await mail_1.default.send(msg);
        console.log("Email sent successfully");
        return { success: true, message: "Email sent successfully" };
    }
    catch (error) {
        console.error("Error sending email:", error.response?.body || error);
        return { success: false, message: "Email failed to send" };
    }
};
exports.sendEmail = sendEmail;
const sendMassEmail = async (recipients, subject, text, html) => {
    const msg = {
        to: recipients.map((email) => ({ email })),
        from: config_1.config.EMAIL_EMAIL,
        subject,
        text,
        html,
    };
    try {
        await mail_1.default.send(msg, true);
        console.log("Mass email sent successfully");
        return { success: true, message: "Mass email sent successfully" };
    }
    catch (error) {
        console.error("Error sending mass email:", error.response?.body || error);
        return { success: false, message: "Mass email failed to send" };
    }
};
exports.sendMassEmail = sendMassEmail;
//# sourceMappingURL=email.js.map