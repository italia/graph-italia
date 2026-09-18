import type { User } from "@prisma/client";
import { logger } from "./logger";
import { maskEmail, sendMail as sendMailViaProvider } from "./mailer";

const SENDER_EMAIL = process.env.SENDER_EMAIL || "";
const HOST = process.env.HOST_URL || "/";
const APP_URL = process.env.APP_URL || "/";
const COPY = "Graph Italia";

/**
 * Templates and the app-level send calls live here; the transport (Resend or
 * SMTP) is chosen in `lib/mailer.ts`, so this module — and every route that
 * imports it — is unaffected by which provider is configured.
 */
function sendMail(addresses: string[], html: string, subject: string = "Activate Account") {
  return sendMailViaProvider({
    to: addresses,
    subject,
    html,
    from: `${COPY} <${SENDER_EMAIL}>`,
  });
}

export function sendActivationEmail(user: User, pin: string) {
  logger.info('Sending activation email', {
    userId: user.id,
    email: maskEmail(user.email),
  });
  const html = activationTemplate(user.id, pin);
  return sendMail([user.email], html, "Activate Your Account");
}

export async function sendResetPasswordEmail(user: User, pin: string) {
  logger.info('Sending password reset email', {
    userId: user.id,
    email: maskEmail(user.email),
  });
  const html = resetTemplate(user.id, pin);
  return sendMail([user.email], html, "Reset Password");
}


// const fontFamily = "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;";

function resetTemplate(uid: string, pin: string) {
  const url = `${APP_URL}/verify/${uid}?action=reset&code=${pin}`;
  const code = pin
    .split("")
    .map((item: string) => {
      return `<span><code style="display:inline;padding:16px 4.5%;width:auto;margin:0 4px;background-color:#f4f4f4;border-radius:5px;border:1px solid #eee;color:#333">${item}</code></span>`;
    })
    .join("");
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" lang="en"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><meta name="x-apple-disable-message-reformatting"/></head><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Reset Password<div></div></div><body style="background-color:#fff;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;"><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;padding:0 12px;margin:0 auto;background-color:#fefefe;border:1px solid #eee"><tbody><tr style="width:100%"><td><h1 style="color:#333;font-size:24px;font-weight:bold;margin:20px 0 40px 0;padding:0">Reset Password</h1><p style="font-size:14px;line-height:24px;margin:24px 0;color:#333;margin-bottom:14px">Click the following link to reset your password</p><a href="${url}" style="color:#00cc66;text-decoration-line:none;font-size:14px;text-decoration:underline;display:block;margin-bottom:16px" target="_blank">${url}</a><p style="font-size:14px;line-height:24px;margin:24px 0;color:#333;margin-bottom:14px">Then, copy and paste this temporary code:</p><div style="margin-top:30px;margin-bottom:30px">${code}</div><p style="font-size:14px;line-height:24px;margin:24px 0;color:#ababab;margin-top:14px;margin-bottom:16px">If you didn't try to reset your password, you can safely ignore this email.</p><p style="font-size:16px;line-height:22px;margin:16px 0;color:#898989;margin-top:45px">${COPY}</p></td></tr></tbody></table></body></html>
  `;
}

function activationTemplate(uid: string, pin: string) {
  // const url = `${HOST}/auth/confirm/${uid}/${pin}`;
  const url = `${APP_URL}/verify/${uid}?action=init&code=${pin}`;
  const code = pin
    .split("")
    .map((item: string) => {
      return `<span><code style="display:inline;padding:16px 4.5%;width:auto;margin:0 4px;background-color:#f4f4f4;border-radius:5px;border:1px solid #eee;color:#333" > ${item} </code></span>`;
    })
    .join("");
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" lang="en">
    <head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    </head>
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Confirm Email</div>
    <body style="background-color:#fff;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;"><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;padding:0 12px;margin:0 auto;background-color:#fefefe;border:1px solid #eee"><tbody><tr style="width:100%"><td>
    <h1 style="color:#333;font-size:24px;font-weight:bold;margin:20px 0 40px 0;padding:0">Confirm Email</h1>
    <p style="font-size:14px;line-height:24px;margin:24px 0;color:#333;margin-bottom:14px">Click the following link to confirm your email</p>
    <a href="${url}" style="color:#00cc66;text-decoration-line:none;font-size:14px;text-decoration:underline;display:block;margin-bottom:16px" target="_blank">${url}</a> 
    <p style="font-size:14px;line-height:24px;margin:24px 0;color:#333;margin-bottom:14px" > Then, copy and paste this temporary code:</p>
    <div style="margin-top:30px;margin-bottom:30px">${code}</div>
    <p style="font-size:14px;line-height:24px;margin:24px 0;color:#ababab;margin-top:14px;margin-bottom:16px"> If you didn't register, you can safely ignore this email, the account never activated will be automatically deleted after some days.</p>
    <p style="font-size:16px;line-height:22px;margin:16px 0;color:#898989;margin-top:45px">${COPY}</p> 
    </td></tr></tbody></table></body></html>`;
}
