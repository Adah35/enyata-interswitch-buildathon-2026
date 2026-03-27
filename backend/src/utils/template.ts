// import { config } from "../config";
// // import * as path from "path";
// import { otp_expiry_date } from "../services/otpService";
// const brandColors = {
//   primary: "#0066FF",
//   primaryDark: "#0052CC",
//   primaryLight: "#E6F0FF",
//   text: "#1A1A1A",
//   textSecondary: "#666666",
//   border: "#E5E5E5",
//   background: "#F8FAFC",
// };

// // Base email wrapper with logo and consistent styling
// export const emailWrapper = (content: string) => {

//   // <img src="cid:ibuamLogo" alt="IBUAM" style="max-width: 180px; display: block; margin: 0 auto;">
//   // Adjust the logo path based on where your logo is stored
//   // For example: `${config.APP_URL}/assets/logo.png` or use a CDN
//   const logoPath = `${config.API_URL}/assets/logo.png`;
//   console.log(logoPath);
//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>${config.APP_NAME}</title>
//     </head>
//     <body style="margin: 0; padding: 0; background-color: ${brandColors.background};">
//       <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${brandColors.background};">
//         <tr>
//           <td align="center" style="padding: 40px 20px;">
//             <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
//               <!-- Header with Logo -->
//               <tr>
//                 <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid ${brandColors.border};">
            

//                 </td>
//               </tr>
              
//               <!-- Content -->
//               <tr>
//                 <td style="padding: 40px;">
//                   ${content}
//                 </td>
//               </tr>
              
//               <!-- Footer -->
//               <tr>
//                 <td style="padding: 30px 40px; text-align: center; border-top: 1px solid ${brandColors.border}; background-color: ${brandColors.background};">
//                   <p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${brandColors.textSecondary};">
//                     © ${new Date().getFullYear()} ${config.APP_NAME}. All rights reserved.
//                   </p>
//                   <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: ${brandColors.textSecondary};">
//                     If you have questions, contact us at <a href="mailto:${config.SUPPORT_EMAIL || 'support@example.com'}" style="color: ${brandColors.primary}; text-decoration: none;">${config.SUPPORT_EMAIL || 'support@example.com'}</a>
//                   </p>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>
//       </table>
//     </body>
//     </html>
//   `;
// };

// export const verifyEmailTemplate = (otp: number) => {
//   const content = `
//     <div style="text-align: center;">
//       <div style="margin-bottom: 24px;">
//         <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 32px; font-weight: 700; color: ${brandColors.primary}; letter-spacing: 2px;">
//           ${config.APP_NAME}
//         </span>
//       </div>
      
//       <h1 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 28px; font-weight: 700; color: ${brandColors.text}; line-height: 1.3;">
//         Verify Your Email Address
//       </h1>
      
//       <p style="margin: 0 0 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; color: ${brandColors.textSecondary}; line-height: 1.6;">
//         Thank you for signing up! Please use the verification code below to complete your registration.
//       </p>
      
//       <div style="background: linear-gradient(135deg, ${brandColors.primaryLight} 0%, #F0F7FF 100%); border: 2px solid ${brandColors.primary}; border-radius: 12px; padding: 24px; margin: 0 0 32px; display: inline-block;">
//         <p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 600; color: ${brandColors.textSecondary}; text-transform: uppercase; letter-spacing: 1px;">
//           Your Verification Code
//         </p>
//         <div style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; color: ${brandColors.primary}; letter-spacing: 8px;">
//           ${otp}
//         </div>
//       </div>

//       <div style="background: #FFF9E6; border-left: 4px solid #FFB800; border-radius: 6px; padding: 16px; margin: 0 0 24px; text-align: left;">
//         <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${brandColors.text};">
//           <strong>⏱️ Time-sensitive:</strong> This code expires in <strong>${otp_expiry_date} minutes</strong>.
//         </p>
//       </div>
      
//       <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${brandColors.textSecondary}; line-height: 1.6;">
//         If you didn't request this verification code, please ignore this email or contact our support team if you have concerns.
//       </p>
//     </div>
//   `;

//   return emailWrapper(content);
// };

// export const resetPasswordTemplate = (resetUrl: string) => {
//   const content = `
//     <div style="text-align: center;">
//       <div style="width: 64px; height: 64px; background: linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px;">
//         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="white"/>
//         </svg>
//       </div>
      
//       <h1 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 28px; font-weight: 700; color: ${brandColors.text}; line-height: 1.3;">
//         Reset Your Password
//       </h1>
      
//       <p style="margin: 0 0 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; color: ${brandColors.textSecondary}; line-height: 1.6;">
//         We received a request to reset your password. Click the button below to create a new password for your account.
//       </p>
      
//       <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%); color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 8px; margin: 0 0 32px; box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3); transition: all 0.3s ease;">
//         Reset My Password
//       </a>
      
//       <p style="margin: 0 0 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${brandColors.textSecondary}; line-height: 1.6;">
//         Or copy and paste this link into your browser:
//       </p>
      
//       <div style="background: ${brandColors.background}; border: 1px solid ${brandColors.border}; border-radius: 6px; padding: 12px; margin: 0 0 32px; word-break: break-all;">
//         <a href="${resetUrl}" style="font-family: 'Courier New', monospace; font-size: 13px; color: ${brandColors.primary}; text-decoration: none;">
//           ${resetUrl}
//         </a>
//       </div>

//       <div style="background: #FFF0F0; border-left: 4px solid #FF4444; border-radius: 6px; padding: 16px; margin: 0 0 24px; text-align: left;">
//         <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${brandColors.text};">
//           <strong>🔒 Security tip:</strong> This link will expire in <strong>1 hour</strong> for your security.
//         </p>
//       </div>

//       <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${brandColors.textSecondary}; line-height: 1.6;">
//         If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.
//       </p>
//     </div>
//   `;

//   return emailWrapper(content);
// };


// export const applicantOnboardingTemplate = ({
//   firstName,
//   email,
//   password,
//   loginUrl,
// }: {
//   firstName: string;
//   email: string;
//   password: string;
//   loginUrl: string;
// }) => {
//   const content = `
//     <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
      
//       <h2 style="color: #1A1A1A; margin-bottom: 12px;">
//         Welcome to ${config.APP_NAME}, ${firstName} 🎓
//       </h2>

//       <p style="color: #555; font-size: 15px; line-height: 1.6;">
//         An admissions officer has created an applicant account for you on 
//         <strong>${config.APP_NAME}</strong>.
//       </p>

//       <p style="color: #555; font-size: 15px; line-height: 1.6;">
//         You can now log in and complete your application form.
//       </p>

//       <div style="background: #F8FAFC; border: 1px solid #E5E5E5; border-radius: 8px; padding: 20px; margin: 24px 0;">
//         <p style="margin: 0 0 8px; font-size: 14px; color: #666;">
//           <strong>Login Email:</strong>
//         </p>
//         <p style="margin: 0 0 16px; font-size: 15px;">
//           ${email}
//         </p>

//         <p style="margin: 0 0 8px; font-size: 14px; color: #666;">
//           <strong>Temporary Password:</strong>
//         </p>
//         <p style="font-family: 'Courier New', monospace; font-size: 18px; color: #0066FF;">
//           ${password}
//         </p>
//       </div>

//       <a href="${loginUrl}" 
//         style="
//           display: inline-block;
//           background: #0066FF;
//           color: #ffffff;
//           padding: 14px 32px;
//           border-radius: 6px;
//           text-decoration: none;
//           font-weight: 600;
//           margin-bottom: 24px;
//         ">
//         Log In & Complete Application
//       </a>

//       <div style="background: #FFF9E6; border-left: 4px solid #FFB800; padding: 14px; margin-top: 24px;">
//         <p style="margin: 0; font-size: 14px; color: #333;">
//           ⚠️ <strong>Important:</strong> For security reasons, please change your password immediately after logging in.
//         </p>
//       </div>

//       <p style="font-size: 14px; color: #666; margin-top: 24px;">
//         If you did not expect this email, please contact our support team immediately.
//       </p>
//     </div>
//   `;

//   return emailWrapper(content);
// };
