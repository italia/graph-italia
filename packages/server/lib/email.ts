import type { User } from "@prisma/client";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const resend = new Resend(RESEND_API_KEY);
const SENDER_EMAIL = process.env.SENDER_EMAIL || "";
const HOST = process.env.HOST_URL || "/";
const APP_URL = process.env.APP_URL || "/";
const COPY = "Dataviz";

async function sendMail(addresses: string[], html: string) {
  const obj = {
    from: SENDER_EMAIL,
    to: addresses.join(";"),
    subject: "Activate Account",
  };
  const result = await resend.emails.send({
    ...obj,
    html,
  });
  console.log("RESULT", result);
  return result;
}

function compileTemplate(template: string, data: any) {
  return template.replace(/\${(.*?)}/g, (_, key) => data[key]);
}

export function sendActivationEmail(user: User, pin: string) {
  const html = activationTemplate(user.id, pin);
  console.log("html", html);
  return sendMail([user.email], html);
}

export async function sendResetPasswordEmail(user: User, pin: string) {
  const html = resetTemplate(user.id, pin);
  return sendMail([user.email], html);
}

function resetTemplate(uid: string, pin: string) {
  const url = `${APP_URL}/verify/${uid}?action=reset`;
  const code = pin
    .split("")
    .map((item: string) => {
      return `<span><code style="display:inline;padding:16px 4.5%;width:auto;margin:0 4px;background-color:#f4f4f4;border-radius:5px;border:1px solid #eee;color:#333">${item}</code></span>`;
    })
    .join("");
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" lang="en"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><meta name="x-apple-disable-message-reformatting"/><!--$--></head><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Reset Password<div></div></div><body style="background-color:#fff"><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;padding:0 12px;margin:0 auto;background-color:#fefefe;border:1px solid #eee"><tbody><tr style="width:100%"><td><h1 style="color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:24px;font-weight:bold;margin:20px 0 40px 0;padding:0">Reset Password</h1><p style="font-size:14px;line-height:24px;margin:24px 0;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin-bottom:14px">Click the following link to reset your password</p><a href="${url}" style="color:#00cc66;text-decoration-line:none;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:14px;text-decoration:underline;display:block;margin-bottom:16px" target="_blank">${url}</a><p style="font-size:14px;line-height:24px;margin:24px 0;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin-bottom:14px">Or, copy and paste this temporary code:</p><div style="margin-top:30px;margin-bottom:30px">${code}</div><p style="font-size:14px;line-height:24px;margin:24px 0;color:#ababab;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin-top:14px;margin-bottom:16px">If you didn&#x27;t try to reset your password, you can safely ignore this email.</p><p style="font-size:16px;line-height:22px;margin:16px 0;color:#898989;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin-top:45px">${COPY}</p></td></tr></tbody></table></body></html>
  `;
}

function activationTemplate(uid: string, pin: string) {
  const url = `${HOST}/auth/confirm/${uid}/${pin}`;
  const code = pin
    .split("")
    .map((item: string) => {
      return `<span><code style="display:inline;padding:16px 4.5%;width:auto;margin:0 4px;background-color:#f4f4f4;border-radius:5px;border:1px solid #eee;color:#333">${item}</code></span>`;
    })
    .join("");

  return `
 <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" lang="en"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><meta name="x-apple-disable-message-reformatting"/></head><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Confirm Your Email<div></div></div><body style="background-color:#fff"><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;padding:0 12px;margin:0 auto;background-color:#fefefe;border:1px solid #eee"><tbody><tr style="width:100%"><td><h1 style="color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:24px;font-weight:bold;margin:20px 0 40px 0;padding:0">Activate</h1><p style="font-size:14px;line-height:24px;margin:24px 0;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin-bottom:14px">Click the following link to confirm your email</p><a href="${url}" style="color:#00cc66;text-decoration-line:none;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:14px;text-decoration:underline;display:block;margin-bottom:16px" target="_blank">${url}</a><p style="font-size:14px;line-height:24px;margin:24px 0;color:#ababab;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin-top:14px;margin-bottom:16px">If you didn&#x27;t try to signup, you can safely ignore this email.</p><p style="font-size:16px;line-height:22px;margin:16px 0;color:#898989;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin-top:45px">${COPY}</p></td></tr></tbody></table></body></html>
  `;
}

// function compileTemplate(template: string, data: any) {
//   return template.replace(/\$(.*?)\$/g, (_, key) => data[key.toLowerCase()]);
// }

// export async function sendActivationEmail(email: string, token: string) {
//   const frontendUrl = process.env.FE_HOST;
//   const template = await fs.readFile(`data/email-templates/activate.html`);
//   const html = compileTemplate(template.toString(), {
//     token,
//     frontendUrl,
//   });
//   await senMail(email, html);
// }

// export async function sendResetPasswordEmail(email: string, token: string) {
//   const frontendUrl = process.env.FE_HOST;
//   const template = await fs.readFile(`data/email-templates/reset.html`);

//   const html = compileTemplate(template.toString(), {
//     token,
//     frontendUrl,
//   });

//   await senMail(email, html);
// }
