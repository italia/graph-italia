import crypto from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import type { User } from '@prisma/client';
import type { CookieOptions, Response } from 'express';

const JWT_SECRET = process?.env['JWT_SECRET'] || '';
// const EXPIRE = 60; //seconds
const EXPIRE = '1d';

export interface IAccessTokenPayload {
  userId: User['id'];
  name: User['email'];
}
export interface IRefreshTokenPayload {
  userId: User['id'];
  jti: string;
}

// Usually I keep the token between 5 minutes - 15 minutes
export function generateAccessToken(
  payload: IAccessTokenPayload,
  expiresIn: string | number = EXPIRE
) {
  console.log('Generating AccessToken', payload);
  console.log('expiresIn', expiresIn);

  return sign(payload, JWT_SECRET, {
    expiresIn,
  });
}

export function generateTokens(user: User) {
  const accessTokenPayload: IAccessTokenPayload = {
    userId: user.id,
    name: user.email,
  };
  const accessToken = generateAccessToken(accessTokenPayload);

  // res.cookie("accessToken", accessToken, {
  //   maxAge: 900000,
  //   httpOnly: true,
  //   signed: true,
  //   secret: "12345",
  // });

  return {
    accessToken,
  };
}

export function verifyAccessToken(token: string) {
  // console.log("Verifying AccessToken", token);
  try {
    return verify(token, JWT_SECRET) as IAccessTokenPayload;
  } catch (error) {
    console.log('Error verifyng AccessToken', error);
    throw error;
  }
}

export function hashToken(token: string) {
  return crypto.createHash('sha512').update(token).digest('hex');
}

// function sendRefreshToken(res: Response, token: string) {
//   res.cookie("refresh_token", token, {
//     httpOnly: true,
//     sameSite: false,
//     path: "/auth",
//   });
// }

export function setAccessTokenCookie(res: Response, token: string) {
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions: CookieOptions = {
    expires,
    httpOnly: true,
    sameSite: 'lax',
    // sameSite: "none",
    // domain: isProduction ? process.env.DOMAIN : "",
    secure: isProduction ? true : false,
  };
  console.log('COOKIE OPTIONS', cookieOptions);
  res.cookie('access_token', token, cookieOptions);
}

export function clearAccestokenCookie(res: Response) {
  res.clearCookie('access_token');
}
