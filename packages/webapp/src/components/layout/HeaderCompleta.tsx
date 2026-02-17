/**
 * Header Completa – Design System Italia (solo quando l'utente NON è loggato)
 * @see https://designers.italia.it/design-system/componenti/header/
 * Struttura: Slim Header + Header Centrale + Header Nav
 */
import { useEffect, useRef, useState } from "react";
import { logout } from "../../lib/api";
import { useUserStore } from "../../store/user_store";
import "./HeaderCompleta.css";

const LINGUE = [
  { code: "ITA", label: "Italiano" },
  { code: "ENG", label: "English" },
] as const;

type MenuSubItem = { name: string; link: string };
type MenuItem =
  | { name: string; link: string }
  | { name: string; link: string; subMenu: readonly MenuSubItem[] };

const MENU: readonly MenuItem[] = [
  {
    name: "Tools",
    link: "",
    subMenu: [
      { name: "Generate Data", link: "/generate-data" },
      { name: "Load Remote Data", link: "/load-data" },
      { name: "Check GeoJSon File", link: "/geo" },
    ],
  },
];

export default function HeaderCompleta() {
  const { user, clearUser } = useUserStore();
  const [linguaSelezionata, setLinguaSelezionata] = useState<"ITA" | "ENG">(
    "ITA",
  );
  const [dropdownLinguaAperto, setDropdownLinguaAperto] = useState(false);
  const [dropdownToolsAperto, setDropdownToolsAperto] = useState(false);
  const [menuMobileAperto, setMenuMobileAperto] = useState(false);
  const dropdownLinguaRef = useRef<HTMLDivElement>(null);
  const dropdownToolsRef = useRef<HTMLLIElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearUser();
    }
    window.location.href = "/";
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        dropdownLinguaRef.current &&
        !dropdownLinguaRef.current.contains(target)
      ) {
        setDropdownLinguaAperto(false);
      }
      if (
        dropdownToolsRef.current &&
        !dropdownToolsRef.current.contains(target)
      ) {
        setDropdownToolsAperto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="it-header-wrapper" role="banner">
      {/* 1. SLIM HEADER */}
      <div className="it-header-slim">
        <div className="it-header-container">
          <div className="it-header-slim-content">
            <a href="https://innovazione.gov.it/" className="it-header-slim-brand" target="_blank" rel="noopener noreferrer">
              Dipartimento per la trasformazione digitale
            </a>
            <div className="it-header-slim-right">
              <div
                className={`it-header-slim-language${dropdownLinguaAperto ? " open" : ""}`}
                ref={dropdownLinguaRef}
              >
                <button
                  type="button"
                  className="it-header-slim-language-toggle"
                  aria-expanded={dropdownLinguaAperto}
                  aria-haspopup="true"
                  aria-label={`Lingua selezionata: ${linguaSelezionata}`}
                  onClick={() => setDropdownLinguaAperto((v) => !v)}
                >
                  <span>{linguaSelezionata}</span>
                  <svg className="it-header-icon it-header-icon-expand" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M11.6 15.4 6 9.8l.7-.8 4.9 4.9L16.5 9l.7.8z" />
                  </svg>
                </button>
                <div className={`it-header-dropdown${dropdownLinguaAperto ? " show" : ""}`} role="list">
                  {LINGUE.map((l) => (
                    <a
                      key={l.code}
                      className={`it-header-dropdown-item${linguaSelezionata === l.code ? " active" : ""}`}
                      href="#"
                      role="listitem"
                      onClick={(e) => {
                        e.preventDefault();
                        setLinguaSelezionata(l.code);
                        setDropdownLinguaAperto(false);
                      }}
                    >
                      {l.code}
                      {linguaSelezionata === l.code && (
                        <span className="visually-hidden"> selezionata</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
              <div className="it-header-slim-login">
                {user ? (
                  <span className="it-header-slim-user">
                    <span className="it-header-slim-user-name">{user.name}</span>
                    <button
                      type="button"
                      className="it-header-slim-btn"
                      onClick={handleLogout}
                    >
                      Esci
                    </button>
                  </span>
                ) : (
                  <a href="/login" className="it-header-slim-btn" aria-label="Accedi">
                    Accedi
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HEADER CENTRALE */}
      <div className="it-header-center">
        <div className="it-header-container">
          <div className="it-header-center-content">
            <div className="it-header-center-brand">
              <a href="/" className="it-header-center-brand-link">
                <svg className="it-header-center-logo" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                <div className="it-header-center-brand-text">
                  <h2 className="it-header-center-title">Dataviz</h2>
                  <p className="it-header-center-tagline">Share your charts</p>
                </div>
              </a>
            </div>
            <div className="it-header-center-right">
              <div className="it-header-center-social">
                <span className="it-header-center-social-label">Seguici su</span>
                <ul className="it-header-center-social-list" aria-label="Seguici su">
                  <li>
                    <a
                      href="https://github.com/italia/dataviz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="it-header-center-social-link"
                      aria-label="GitHub (si apre in nuova finestra)"
                    >
                      <svg className="it-header-center-social-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. HEADER NAV */}
      <div className="it-header-nav">
        <div className="it-header-container">
          <div className="it-header-nav-content">
            <button
              type="button"
              className="it-header-nav-hamburger"
              aria-label="Menu"
              aria-expanded={menuMobileAperto}
              onClick={() => setMenuMobileAperto((v) => !v)}
            >
              <svg className="it-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                {menuMobileAperto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
              <span className="it-header-nav-hamburger-label">Menu</span>
            </button>

            <nav
              className={`it-header-nav-menu${menuMobileAperto ? " open" : ""}`}
              aria-label="Navigazione principale"
            >
              <ul className="it-header-nav-list">
                {MENU.map((item) => {
                  if ("subMenu" in item) {
                    return (
                      <li
                        key={item.name}
                        className="it-header-nav-item it-header-nav-dropdown-item"
                        ref={dropdownToolsRef}
                      >
                        <button
                          type="button"
                          className="it-header-nav-link"
                          aria-expanded={dropdownToolsAperto}
                          aria-haspopup="true"
                          onClick={() => setDropdownToolsAperto((v) => !v)}
                        >
                          {item.name}
                          <svg className="it-header-icon it-header-icon-expand" aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M11.6 15.4 6 9.8l.7-.8 4.9 4.9L16.5 9l.7.8z" />
                          </svg>
                        </button>
                        <ul className={`it-header-dropdown${dropdownToolsAperto ? " show" : ""}`} role="menu">
                          {item.subMenu.map((sub: MenuSubItem) => (
                            <li key={sub.name} role="none">
                              <a
                                href={sub.link}
                                className="it-header-dropdown-item"
                                role="menuitem"
                                onClick={() => setMenuMobileAperto(false)}
                              >
                                {sub.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  }
                  return (
                    <li key={item.name} className="it-header-nav-item">
                      <a
                        href={item.link}
                        className="it-header-nav-link"
                        onClick={() => setMenuMobileAperto(false)}
                      >
                        {item.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
