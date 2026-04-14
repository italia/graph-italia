import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { logout } from "../../lib/api";
import type { MenuSubItem } from "../../router";
import { MENU, ROUTES } from "../../router";
import { useUserStore } from "../../lib/store/user_store";
import { useSettingsStore } from "../../lib/store/settings_store";
import ThemeSwitcherComponent from "./ThemeSwitcher.tsx";
import LanguageSwitcher from "./LanguageSwitcher.tsx";

export default function HeaderCompleta() {
  const { t } = useTranslation("components", {
    keyPrefix: "components.layout.fullHeader",
  });
  const { t: translateMenu } = useTranslation("menu");
  const { user, clearUser } = useUserStore();
  const { settings, setTheme, setLanguage } = useSettingsStore();
  const theme = settings?.preferredTheme;
  const language = settings?.preferredLanguage ?? "it";
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const dropdownRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearUser();
    }
    window.location.href = ROUTES.root;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedInside = Object.values(dropdownRefs.current).some(
        (el) => el && el.contains(target),
      );
      if (!clickedInside) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="shadow-[0_0.5rem_1rem_rgba(0,0,0,0.15)]">

      {/* ── 1. SLIM BAR — accent (#0059b3), h-12, text-sm ── */}
      <div className="bg-accent">
        <div className="mx-auto px-[18px] flex items-center justify-between h-12">
          <a
            href="https://innovazione.gov.it/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent-content no-underline hover:text-accent-content transition-colors duration-150"
          >
            {t(`slim.brand.title`)}
          </a>


          <div className="flex items-center gap-6 text-accent-content">
            <LanguageSwitcher
              currentLanguage={language}
              handleChange={setLanguage}
            />
          </div>
        </div>
      </div>

      {/* ── 2. CENTRE BAND — primary (#06c), logo 80px, title 1.75rem ── */}
      <div className="bg-primary">
        <div className="mx-auto px-[18px] flex items-center justify-between py-6">
          <a
            href={ROUTES.root}
            aria-label={t(`center.brand.title`)}
            className="flex items-center gap-4 no-underline group"
          >
            <svg
              className="w-20 h-20 shrink-0 text-primary-content"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
            <div>
              <span className="block text-[1.75rem] font-semibold leading-tight text-primary-content ">
                {t(`center.brand.title`)}
              </span>
              <p className="text-sm font-normal text-primary-content m-0 mt-0.5">
                {t(`center.brand.tagline`)}
              </p>
            </div>
          </a>

          {/* Right: social + theme + login */}
          <div className="flex items-center gap-3">
            {/* Social icons – desktop only */}
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-sm text-primary-content mr-2">
                {t(`center.social.label`)}
              </span>
              <ul className="flex items-center list-none m-0 p-0" aria-label={t(`center.social.label`)}>
                <li>
                  <a
                    href="https://github.com/italia/dataviz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 text-primary-content hover:text-primary-content transition-colors duration-150"
                    aria-label={t(`center.social.platforms.github.ariaLabel`) || "GitHub"}
                  >
                    <svg className="w-6 h-6" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>



          </div>
        </div>
      </div>

      {/* ── 3. NAV BAND — primary (#06c), nav-link py-2 px-4 text-sm ── */}
      <div className="bg-primary relative">
        <div className="mx-auto px-[18px] flex items-center h-12">

          {/* Hamburger – mobile only */}
          <button
            type="button"
            className="flex items-center gap-2 text-primary-content hover:text-primary-content lg:hidden cursor-pointer bg-transparent border-none transition-colors duration-150"
            aria-label="Menu"
            aria-expanded={menuMobileOpen}
            onClick={() => setMenuMobileOpen((v) => !v)}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              {menuMobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
            <span className="text-sm">{t(`nav.content.hamburger.label`)}</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex w-full items-center justify-between" aria-label="Navigazione principale">
            <ul className="flex items-center list-none m-0 p-0">
              {MENU.map((item) => {
                if ("subMenu" in item) {
                  return (
                    <li key={item.name} className="relative" ref={(el) => { dropdownRefs.current[item.name] = el; }}>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 px-4 py-2 text-sm text-primary-content/90 hover:text-primary-content hover:bg-primary-content/10 transition-colors duration-150 bg-transparent border-none cursor-pointer"
                        aria-expanded={openDropdown === item.name}
                        aria-haspopup="true"
                        onClick={() => setOpenDropdown((v) => v === item.name ? null : item.name)}
                      >
                        {item.translationKey ? translateMenu(item.translationKey) : item.name}
                        <svg
                          className={`w-4 h-4 fill-current shrink-0 transition-transform duration-200 ${openDropdown === item.name ? "rotate-180" : ""}`}
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                        >
                          <path d="M11.6 15.4 6 9.8l.7-.8 4.9 4.9L16.5 9l.7.8z" />
                        </svg>
                      </button>

                      <ul
                        className={`absolute top-full left-0 z-[1000] min-w-48 py-2 bg-base-100 text-base-content rounded shadow-[0_0.5rem_1rem_rgba(0,0,0,0.15)] list-none m-0 p-0 ${openDropdown === item.name ? "block" : "hidden"}`}
                      >
                        {item.subMenu.map((sub: MenuSubItem) => (
                          <li key={sub.name}>
                            <a
                              href={sub.link}
                              className="block px-4 py-2 text-sm text-base-content no-underline hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                              onClick={() => setMenuMobileOpen(false)}
                            >
                              {sub.translationKey ? translateMenu(sub.translationKey) : sub.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }
                return (
                  <li key={item.name}>
                    <a
                      href={item.link}
                      className="inline-flex items-center px-4 py-2 text-sm text-primary-content/90 hover:text-primary-content hover:bg-primary-content/10 no-underline transition-colors duration-150"
                      onClick={() => setMenuMobileOpen(false)}
                    >
                      {item.translationKey ? translateMenu(item.translationKey) : item.name}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Login / logout – desktop nav right */}
            {user ? (
              <span className="flex items-center gap-3">
                <span className="text-sm text-primary-content/70">{user.name}</span>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm text-primary-content/90 hover:text-primary-content hover:bg-primary-content/10 transition-colors duration-150 bg-transparent border-none cursor-pointer"
                  onClick={handleLogout}
                >
                  {t(`slim.actions.logout.label`)}
                </button>
              </span>
            ) : (
              <a
                href={ROUTES.login}
                className="inline-flex items-center px-4 py-2 text-sm text-primary-content/90 hover:text-primary-content hover:bg-primary-content/10 no-underline transition-colors duration-150"
              >
                {t(`slim.actions.login.label`)}
              </a>
            )}
          </nav>
        </div>

        {/* Mobile slide-down */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-primary shadow-[0_0.5rem_1rem_rgba(0,0,0,0.15)] overflow-hidden z-[999] transition-all duration-200 ease-in-out ${menuMobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"}`}
          aria-hidden={!menuMobileOpen}
        >
          <ul className="list-none m-0 px-[18px] py-2">
            {MENU.map((item) => {
              if ("subMenu" in item) {
                return (
                  <li key={item.name} className="border-b border-primary-content/20">
                    <span className="block py-3 text-sm font-semibold text-primary-content">
                      {item.translationKey ? translateMenu(item.translationKey) : item.name}
                    </span>
                    <ul className="list-none m-0 ml-3 pb-2 p-0">
                      {item.subMenu.map((sub: MenuSubItem) => (
                        <li key={sub.name}>
                          <a
                            href={sub.link}
                            className="block py-2 text-sm text-primary-content no-underline hover:text-primary-content transition-colors duration-150"
                            onClick={() => setMenuMobileOpen(false)}
                          >
                            {sub.translationKey ? translateMenu(sub.translationKey) : sub.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
              return (
                <li key={item.name} className="border-b border-primary-content/20 last:border-b-0">
                  <a
                    href={item.link}
                    className="block py-3 text-sm text-primary-content no-underline hover:text-primary-content transition-colors duration-150"
                    onClick={() => setMenuMobileOpen(false)}
                  >
                    {item.translationKey ? translateMenu(item.translationKey) : item.name}
                  </a>
                </li>
              );
            })}

            {/* Login / logout – mobile menu */}
            <li className="border-t border-primary-content/20 mt-1 pt-1">
              {user ? (
                <button
                  type="button"
                  className="block w-full text-left py-3 text-sm text-primary-content no-underline hover:text-primary-content/80 bg-transparent border-none cursor-pointer transition-colors duration-150"
                  onClick={() => { setMenuMobileOpen(false); handleLogout(); }}
                >
                  {user.name} · {t(`slim.actions.logout.label`)}
                </button>
              ) : (
                <a
                  href={ROUTES.login}
                  className="block py-3 text-sm text-primary-content no-underline hover:text-primary-content/80 transition-colors duration-150"
                  onClick={() => setMenuMobileOpen(false)}
                >
                  {t(`slim.actions.login.label`)}
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>

    </header>
  );
}
