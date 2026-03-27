import fs from "fs";
// import path from "path";
import sgMail from "@sendgrid/mail";
import { config } from "../config";

sgMail.setApiKey(config.SENDGRID_API_KEY || " ");

export const sendEmail = async (
  email: string,
  subject: string,
  message: string
) => {
  // Path to your logo (make sure it exists in your build)
  // const logoPath = path.join(__dirname, "../assets/logo.png");
  // const logoContent = fs.readFileSync(logoPath).toString("base64");

  const msg: any = {
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
    await sgMail.send(msg);
    console.log("Email sent successfully");
    return { success: true, message: "Email sent successfully" };
  } catch (error: any) {
    console.error("Error sending email:", error.response?.body || error);
    return { success: false, message: "Email failed to send" };
  }
};


export const sendMassEmail = async (
  recipients: string[],
  subject: string,
  text: string,
  html?: string
) => {
  const msg = {
    to: recipients.map((email) => ({ email })),
    from: config.EMAIL_EMAIL,
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg, true);
    console.log("Mass email sent successfully");
    return { success: true, message: "Mass email sent successfully" };
  } catch (error) {
    console.error("Error sending mass email:", error.response?.body || error);
    return { success: false, message: "Mass email failed to send" };
  }
};
