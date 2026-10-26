/**
 * Records, per browser, that the terms and privacy policy were accepted before a
 * SPID/CIE login. Keyed by the documents' version: when the legal texts change,
 * bump TERMS_VERSION and the checkbox comes back for everyone.
 *
 * The server never sees this. It only spares returning users the checkbox; every
 * new account still accepts the terms on the signup form.
 */
export const TERMS_VERSION = "2026-10-21";
const STORAGE_KEY = "termsAcceptedVersion";

export function hasAcceptedTerms(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === TERMS_VERSION;
  } catch {
    return false;
  }
}

export function markTermsAccepted(): void {
  try {
    localStorage.setItem(STORAGE_KEY, TERMS_VERSION);
  } catch {
    // Storage unavailable (private mode, blocked): the checkbox just shows again.
  }
}
