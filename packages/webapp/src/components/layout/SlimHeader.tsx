/**
 * Slim Header – una sola fascia blu (solo quando l'utente È loggato).
 * Brand Dataviz, menu nav, lingua, nome utente / Esci.
 */
import { useEffect, useRef, useState } from "react";
import { logout } from "../../lib/api";
import { useUserStore } from "../../store/user_store";
import  type {  MenuSubItem, MenuItem } from "../../router";
import { MENU } from "../../router";
import "./SlimHeader.css";


export default function SlimHeader() {
  const { user, clearUser } = useUserStore();
  const [dropdownToolsAperto, setDropdownToolsAperto] = useState(false);
  const [menuMobileAperto, setMenuMobileAperto] = useState(false);
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
    <header className="it-slim-only-wrapper" role="banner">
      <div className="it-slim-only">
        <div className="it-slim-only-container">
          <div className="it-slim-only-content">
            <div className="it-slim-only-brand">
              <a href="/" className="it-slim-only-brand-title">
                Dataviz
              </a>
              <button
                type="button"
                className="it-slim-only-hamburger"
                aria-label="Menu"
                aria-expanded={menuMobileAperto}
                onClick={() => setMenuMobileAperto((v) => !v)}
              >
                <span />
                <span />
                <span />
              </button>
              <span className="it-slim-only-sep" aria-hidden="true" />
              <nav className="it-slim-only-nav" aria-label="Principale">
                <ul className="it-slim-only-nav-list">
                  {MENU.map((item) => {
                    if ("subMenu" in item) {
                      return (
                        <li
                          key={item.name}
                          className="it-slim-only-nav-item it-slim-only-nav-dropdown"
                          ref={dropdownToolsRef}
                        >
                          <button
                            type="button"
                            className="it-slim-only-nav-link"
                            aria-expanded={dropdownToolsAperto}
                            aria-haspopup="true"
                            onClick={() =>
                              setDropdownToolsAperto((v) => !v)
                            }
                          >
                            {item.name}
                            <svg
                              className="it-slim-only-icon it-slim-only-icon-expand"
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                            >
                              <path d="M11.6 15.4 6 9.8l.7-.8 4.9 4.9L16.5 9l.7.8z" />
                            </svg>
                          </button>
                          <ul
                            className={`it-slim-only-dropdown-menu${dropdownToolsAperto ? " show" : ""}`}
                            role="menu"
                          >
                            {item.subMenu.map((sub: MenuSubItem) => (
                              <li key={sub.name} role="none">
                                <a
                                  href={sub.link}
                                  className="it-slim-only-dropdown-item"
                                  role="menuitem"
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
                      <li
                        key={item.name}
                        className="it-slim-only-nav-item"
                      >
                        <a
                          href={item.link}
                          className="it-slim-only-nav-link"
                        >
                          {item.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            <div className="it-slim-only-actions">
              <div className="it-slim-only-actions-right">
                {user ? (
                  <span className="it-slim-only-user">
                    <span className="it-slim-only-user-name">
                      {user.name}
                    </span>
                    <button
                      type="button"
                      className="it-slim-only-btn it-slim-only-btn-outline"
                      onClick={handleLogout}
                    >
                      Esci
                    </button>
                  </span>
                ) : (
                  <a
                    href="/login"
                    className="it-slim-only-btn it-slim-only-btn-outline"
                    aria-label="Accedi"
                  >
                    Accedi
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`it-slim-only-mobile-menu${menuMobileAperto ? " open" : ""}`}
        aria-hidden={!menuMobileAperto}
      >
        <ul className="it-slim-only-mobile-list">
          {MENU.map((item) => {
            if ("subMenu" in item) {
              return (
                <li key={item.name}>
                  <span className="it-slim-only-mobile-label">
                    {item.name}
                  </span>
                  <ul className="it-slim-only-mobile-sublist">
                    {item.subMenu.map((sub: MenuSubItem) => (
                      <li key={sub.name}>
                        <a
                          href={sub.link}
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
              <li key={item.name}>
                <a href={item.link} onClick={() => setMenuMobileAperto(false)}>
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
