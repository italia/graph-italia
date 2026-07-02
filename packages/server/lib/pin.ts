import { randomInt } from "crypto";

// Cryptographically-secure, uniform 6-digit PIN (000000–999999).
// Math.random() is not a CSPRNG and its .slice(2,8) could yield <6 digits,
// shrinking the code space — both make the activation/recovery PIN guessable.
export default function generatePin() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}
