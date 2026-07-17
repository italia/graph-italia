import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { logout } from "../../lib/api";
import { broadcastAuth } from "../../lib/authChannel.ts";
import { useSettingsStore } from "../../lib/store/settings_store.ts";
import { useUserStore } from "../../lib/store/user_store.ts";
import type { MenuSubItem } from "../../router";
import { MENU, ROUTES } from "../../router";
import LanguageSwitcher from "./LanguageSwitcher.tsx";
import { FaUsers, FaKey, FaEnvelope, FaTrash, FaArrowRightFromBracket } from "react-icons/fa6";
import ThemeSwitcherComponent from "./ThemeSwitcher.tsx";


export default function Header() {
  const { t } = useTranslation("components", {
    keyPrefix: "components.layout.slimHeader",
  });
  const { t: translateMenu } = useTranslation("menu");
  const { user, clearUser } = useUserStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownUserOpen, setDropdownUserOpen] = useState(false);
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const dropdownUserRef = useRef<HTMLDivElement>(null);

  const { settings, setTheme, setLanguage } = useSettingsStore();
  const theme = settings?.preferredTheme;
  const language = settings?.preferredLanguage ?? "it";

  const navigationMenu = MENU.filter(item => item.name !== "Settings");
  const settingsMenuItem = MENU.find(item => item.name === "Settings");

  const handleLogout = async () => {

    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearUser();
      broadcastAuth("logout"); // sign out every other open tab too
    }
    window.location.href = "/";
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setOpenDropdown(null);
      }
      if (
        dropdownUserRef.current &&
        !dropdownUserRef.current.contains(target)
      ) {
        setDropdownUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative" ref={headerRef}>
      {/* ── Main bar ── */}
      <div className="navbar bg-primary text-primary-content border-b border-primary-content/20 p-4 lg:px-10 min-h-12 shadow-md z-20">
        {/* Left: hamburger + brand + separator + desktop nav */}
        <div className="navbar-start flex items-center gap-4 ">
          {/* Hamburger – mobile only */}
          <button
            type="button"
            className="btn btn-ghost btn-square text-primary-content lg:hidden flex flex-col justify-center gap-[5px]"
            aria-label="Menu"
            aria-expanded={menuMobileOpen}
            onClick={() => setMenuMobileOpen((v) => !v)}
          >
            <span
              className={`block w-full h-0.5 bg-current rounded transition-transform duration-200 ${menuMobileOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`block w-full h-0.5 bg-current rounded transition-opacity duration-200 ${menuMobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-full h-0.5 bg-current rounded transition-transform duration-200 ${menuMobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>

          {/* Brand */}
          <a
            href={ROUTES.root}
            className="text-primary-content text-base font-normal no-underline  cursor leading-snug"
          >
            <div className="flex items-center justify-center">
              <img className="w-12 h-12 shrink-0 text-primary-content" aria-hidden="true" src="/logo_header.svg" alt={t(`brand.title`)} />
              <span className="font-semibold text-2xl">{t(`brand.title`)}</span>
            </div>
          </a>

          {/* Separator – desktop only */}
          <span
            className="hidden lg:block w-px h-5 bg-primary-content/20 shrink-0"
            aria-hidden="true"
          />

          {/* Desktop nav */}
          <nav className="hidden lg:block" aria-label="Principale">
            <ul className="flex items-center gap-1 list-none m-0 p-0">
              {navigationMenu.map((item) => {

                if ("subMenu" in item) {
                  const isOpen = openDropdown === item.name;
                  return (
                    <li
                      key={item.name}
                      className="relative"
                    >
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-primary-content text-sm rounded bg-transparent border-none cursor-pointer hover:bg-primary-content/15"
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onClick={() => setOpenDropdown(isOpen ? null : item.name)}
                      >
                        {item.translationKey
                          ? translateMenu(item.translationKey)
                          : item.name}
                        <svg
                          className={`w-4 h-4 fill-current shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                        >
                          <path d="M11.6 15.4 6 9.8l.7-.8 4.9 4.9L16.5 9l.7.8z" />
                        </svg>
                      </button>

                      <ul
                        className={`absolute top-full left-0 z-[1000] min-w-40 py-2 mt-1 bg-base-100 text-base-content border border-base-300 rounded shadow-md list-none m-0 p-0 ${isOpen ? "block" : "hidden"}`}
                      >
                        {item.subMenu.map((sub: MenuSubItem) => (
                          <li key={sub.name}>
                            <a
                              href={sub.link}
                              className="block px-4 py-2 text-sm text-base-content no-underline  hover:bg-base-200 hover: text-base-content"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {sub.translationKey
                                ? translateMenu(sub.translationKey)
                                : sub.name}
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
                      className="inline-flex items-center px-3 py-1.5 text-primary-content text-sm rounded no-underline hover:bg-primary-content/15"
                    >
                      {item.translationKey
                        ? translateMenu(item.translationKey)
                        : item.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Right: language + theme + user/login */}
        <div className="navbar-end flex items-center gap-4">
          <div className="rounded px-2">
            <ThemeSwitcherComponent
              currentTheme={theme as "light" | "dark"}
              handleChange={setTheme}
            />
          </div>
          <LanguageSwitcher
            currentLanguage={language}
            handleChange={setLanguage}
          />

          {user ? (
            <div className="relative" ref={dropdownUserRef}>
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 rounded-full text-primary-content hover:bg-primary-content/15 bg-transparent border-none cursor-pointer transition-colors duration-150"
                aria-label={user.name}
                aria-expanded={dropdownUserOpen}
                aria-haspopup="true"
                onClick={() => setDropdownUserOpen((v) => !v)}
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </button>

              {dropdownUserOpen && (
                <ul className="absolute right-0 top-full mt-1 z-[1000] min-w-56 py-2 bg-base-100 text-base-content border border-base-300 rounded shadow-md list-none m-0 p-0 overflow-hidden">
                  <li className="px-4 py-3 text-base bg-base-200/50 border-b border-base-300 select-none">
                    <div className="flex flex-col">
                      <span className="text-base-content opacity-70 text-base uppercase tracking-wider">{t("user.loggedAs", "Logged as")}</span>
                      <span className="truncate">{user.name}</span>

                    </div>
                  </li>

                  {/* Settings Items from MENU */}
                  {settingsMenuItem && "subMenu" in settingsMenuItem && (
                    <>
                      {settingsMenuItem.subMenu.map((sub) => (
                        <li key={sub.name}>
                          <a
                            href={sub.link}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-base-content no-underline  hover:bg-base-200 hover: text-base-content transition-colors duration-150"
                            onClick={() => setDropdownUserOpen(false)}
                          >
                            {sub.name === "API Keys" ? <FaKey className="w-4 h-4 opacity-70" /> : <FaUsers className="w-4 h-4 opacity-70" />}
                            <span>
                              {sub.translationKey ? translateMenu(sub.translationKey) : sub.name}
                            </span>
                          </a>
                        </li>
                      ))}
                      <div className="divider my-0 opacity-20"></div>
                    </>
                  )}

                  {/* <li>
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-base-content bg-transparent border-none cursor-pointer  hover:bg-base-200 hover: text-base-content transition-colors duration-150 text-left"
                      onClick={() => setDropdownUserOpen(false)}
                    >
                      <FaEnvelope className="w-4 h-4 opacity-70" />
                      {t(`actions.askMyData.label`)}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error bg-transparent border-none cursor-pointer hover:bg-error/10 transition-colors duration-150 text-left"
                      onClick={() => setDropdownUserOpen(false)}
                    >
                      <FaTrash className="w-4 h-4 opacity-70" />
                      {t(`actions.requestAccountDeletion.label`)}
                    </button>
                  </li> */}

                  <div className="divider my-0 opacity-20"></div>
                  <li>
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-base-content font-medium bg-transparent border-none cursor-pointer hover:bg-base-200 hover: text-base-content transition-colors duration-150 text-left"
                      onClick={() => { setDropdownUserOpen(false); handleLogout(); }}
                    >
                      <FaArrowRightFromBracket className="w-4 h-4 opacity-70" />
                      {t(`actions.logout.label`)}
                    </button>
                  </li>
                </ul>
              )}

            </div>
          ) : (
            <a
              href={ROUTES.login}
              className="btn btn-sm btn-ghost border border-primary-content/40 text-primary-content hover:bg-primary-content/20"
              aria-label="Accedi"
            >
              {t(`actions.login.label`)}
            </a>
          )}
        </div>
      </div>

      {/* ── Mobile slide-down menu ── */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-primary border-b border-primary-content/20 shadow-md overflow-hidden z-[999] transition-all duration-200 ease-in-out ${menuMobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"}`}
        aria-hidden={!menuMobileOpen}
      >
        <ul className="list-none m-0 p-4">
          {navigationMenu.map((item) => {
            if ("subMenu" in item) {

              return (
                <li
                  key={item.name}
                  className="border-b border-primary-content/20"
                >
                  <span className="block py-3 text-[0.9375rem] text-primary-content">
                    {item.translationKey
                      ? translateMenu(item.translationKey)
                      : item.name}
                  </span>
                  <ul className="list-none m-0 ml-4 pb-2 p-0">
                    {item.subMenu.map((sub: MenuSubItem) => (
                      <li key={sub.name}>
                        <a
                          href={sub.link}
                          className="block py-2 text-sm text-primary-content no-underline hover:text-primary-content/80"
                          onClick={() => setMenuMobileOpen(false)}
                        >
                          {sub.translationKey
                            ? translateMenu(sub.translationKey)
                            : sub.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }
            return (
              <li
                key={item.name}
                className="border-b border-primary-content/20 last:border-b-0"
              >
                <a
                  href={item.link}
                  className="block py-3 text-[0.9375rem] text-primary-content no-underline hover:text-primary-content/80"
                  onClick={() => setMenuMobileOpen(false)}
                >
                  {item.translationKey ? translateMenu(item.translationKey) : item.name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
