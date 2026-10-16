-- Lowercase stored emails. Lookups are case-insensitive and new accounts are
-- stored lowercased; this aligns the existing rows.
--
-- Only rows whose lowercased email is not shared with another account are
-- touched, so this can never hit the (case-sensitive) unique constraint and
-- never fails a deploy. Accounts that differ only by case are merged from the
-- admin panel ("Duplicate emails"), which lowercases the kept email.

UPDATE "User" AS u
SET "email" = lower(trim(u."email"))
WHERE u."email" <> lower(trim(u."email"))
  AND NOT EXISTS (
    SELECT 1 FROM "User" AS o
    WHERE o."id" <> u."id"
      AND lower(trim(o."email")) = lower(trim(u."email"))
  );
