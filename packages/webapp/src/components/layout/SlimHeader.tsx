import { useEffect, useRef, useState } from "react";
import { logout } from "../../lib/api";
import { useUserStore } from "../../store/user_store";
import "./SlimHeader.css";

const LINGUE = [
  { code: "ITA", label: "Italiano" },
  { code: "ENG", label: "English" },
] as const;

type MenuSubItem = { name: string; link: string };
type MenuItem =
  | { name: string; link: string }
  | { name: string; link: string; subMenu: readonly MenuSubItem[] };

const MENU: readonly MenuItem[] = [
  { name: "Charts", link: "/home" },
  { name: "Dashboards", link: "/dashboards" },
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

export default function SlimHeader() {
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
    <header className="it-header-slim-wrapper" role="banner">
      <div className="it-header-slim">
        <div className="it-header-slim-container">
          <div className="it-header-slim-row">
            <div className="it-header-slim-col">
              <div className="it-header-slim-wrapper-content">
                <div className="it-header-slim-brand">
                  <a href="/" className="it-header-slim-brand-title">
                    Dataviz
                  </a>
                  <button
                    type="button"
                    className="it-header-slim-hamburger"
                    aria-label="Menu"
                    aria-expanded={menuMobileAperto}
                    onClick={() => setMenuMobileAperto((v) => !v)}
                  >
                    <span />
                    <span />
                    <span />
                  </button>
                  <span className="it-header-slim-sep" aria-hidden="true" />
                  <nav className="it-header-slim-nav" aria-label="Principale">
                    <ul className="it-header-slim-nav-list">
                      {MENU.map((item) => {
                        if ("subMenu" in item) {
                          return (
                            <li
                              key={item.name}
                              className="it-header-slim-nav-item it-header-slim-nav-dropdown"
                              ref={dropdownToolsRef}
                            >
                              <button
                                type="button"
                                className="it-header-slim-nav-link"
                                aria-expanded={dropdownToolsAperto}
                                aria-haspopup="true"
                                onClick={() =>
                                  setDropdownToolsAperto((v) => !v)
                                }
                              >
                                {item.name}
                                <svg
                                  className="it-header-slim-icon it-header-slim-icon-expand"
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M11.6 15.4 6 9.8l.7-.8 4.9 4.9L16.5 9l.7.8z" />
                                </svg>
                              </button>
                              <ul
                                className={`it-header-slim-dropdown-menu${dropdownToolsAperto ? " show" : ""}`}
                                role="menu"
                              >
                                {item.subMenu.map((sub: MenuSubItem) => (
                                  <li key={sub.name} role="none">
                                    <a
                                      href={sub.link}
                                      className="it-header-slim-dropdown-item"
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
                            className="it-header-slim-nav-item"
                          >
                            <a
                              href={item.link}
                              className="it-header-slim-nav-link"
                            >
                              {item.name}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>

                <div className="it-header-slim-actions">
                  <div
                    className={`it-header-slim-language dropdown${dropdownLinguaAperto ? " open" : ""}`}
                    ref={dropdownLinguaRef}
                  >
                    <button
                      type="button"
                      className="it-header-slim-language-toggle"
                      aria-expanded={dropdownLinguaAperto}
                      aria-haspopup="true"
                      aria-label={`Lingua: ${linguaSelezionata}`}
                      id="language-selector"
                      onClick={() => setDropdownLinguaAperto((v) => !v)}
                    >
                      <span className="it-header-slim-d-none it-header-slim-d-md-inline">
                        Lingua:{" "}
                      </span>
                      <span aria-hidden="true">{linguaSelezionata}</span>
                      <svg
                        className="it-header-slim-icon it-header-slim-icon-expand"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.6 15.4 6 9.8l.7-.8 4.9 4.9L16.5 9l.7.8z" />
                      </svg>
                    </button>
                    <div
                      className={`it-header-slim-dropdown-menu it-header-slim-lang-menu${dropdownLinguaAperto ? " show" : ""}`}
                      aria-labelledby="language-selector"
                      role="list"
                    >
                      {LINGUE.map((l) => (
                        <a
                          key={l.code}
                          className={`it-header-slim-dropdown-item${linguaSelezionata === l.code ? " active" : ""}`}
                          href="#"
                          role="listitem"
                          onClick={(e) => {
                            e.preventDefault();
                            setLinguaSelezionata(l.code);
                            setDropdownLinguaAperto(false);
                          }}
                        >
                          {l.code}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="it-header-slim-actions-right">
                    {user ? (
                      <span className="it-header-slim-user">
                        <span className="it-header-slim-user-name">
                          {user.name}
                        </span>
                        <button
                          type="button"
                          className="it-header-slim-btn it-header-slim-btn-outline"
                          onClick={handleLogout}
                        >
                          Esci
                        </button>
                      </span>
                    ) : (
                      <a
                        href="/login"
                        className="it-header-slim-btn it-header-slim-btn-outline"
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
        </div>
      </div>

      <div
        className={`it-header-slim-mobile-menu${menuMobileAperto ? " open" : ""}`}
        aria-hidden={!menuMobileAperto}
      >
        <ul className="it-header-slim-mobile-list">
          {MENU.map((item) => {
            if ("subMenu" in item) {
              return (
                <li key={item.name}>
                  <span className="it-header-slim-mobile-label">
                    {item.name}
                  </span>
                  <ul className="it-header-slim-mobile-sublist">
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
