import type { TFunction } from "i18next";
import type { z as zod, ZodType, ZodTypeDef } from "zod";

export type PasswordRuleKey =
  | "minLength"
  | "uppercase"
  | "lowercase"
  | "number"
  | "specialChar";

export const PASSWORD_RULES: {
  key: PasswordRuleKey;
  test: (password: string) => boolean;
}[] = [
  { key: "minLength", test: (p) => p.length >= 8 },
  { key: "uppercase", test: (p) => /[A-Z]/.test(p) },
  { key: "lowercase", test: (p) => /[a-z]/.test(p) },
  { key: "number", test: (p) => /[0-9]/.test(p) },
  { key: "specialChar", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function getPasswordSchema(
  z: typeof zod,
  t: TFunction<"translation", undefined>,
) {
  let schema: ZodType<string, ZodTypeDef, string> = z.string();
  for (const rule of PASSWORD_RULES) {
    schema = schema.refine(rule.test, {
      message: t(`form.fields.password.errors.${rule.key}`),
    });
  }
  return schema;
}
