import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useRole } from "../../context/RoleContext";

const navItems = [
  ["/", "Overview", "OV"],
  ["/assets", "Assets", "AS"],
  ["/map", "Map", "MP"],
  ["/inspections", "Inspections", "IN"],
  ["/maintenance", "Maintenance", "MA"],
  ["/alerts", "Alerts", "AL"],
];

export function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const { role, clearRole } = useRole();

  const logout = () => {
    clearRole();
    navigate("/", { replace: true });
  };

  const displayRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "Viewer";

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">P</span>

          <div>
            <strong>PRAVI</strong>
            <small>ASSET CONTROL</small>
          </div>
        </div>

        <div className="workspace-label">OPERATIONS CONSOLE</div>

        <nav>
          {navItems.map(([to, label, icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>{icon}</span>
              <label>{label}</label>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="operator-status">
            <span className="status-pulse" />
            Live system
          </div>

          <div className="operator-role">{displayRole} operator</div>

          <button className="logout-button" onClick={logout}>
            <span>↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button"
            aria-label="Toggle sidebar"
            onClick={() => setCollapsed(!collapsed)}
          >
            ☰
          </button>

          <div className="crumb">
            Infrastructure / <strong>Control room</strong>
          </div>

          <div className="topbar-actions">
            <div className="global-search">
              <span>⌕</span>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && search.trim()) {
                    navigate(`/assets?search=${encodeURIComponent(search)}`);
                  }
                }}
                placeholder="Search assets..."
              />
            </div>

            <div className="current-role">
              <span className="current-role-dot" />
              {displayRole}
            </div>

            <span className="top-date">28 SEP 2026</span>

            <span className="notification">
              <i />●
            </span>
          </div>
        </header>

        <div className="content">{children}</div>
      </main>
    </div>
  );
}
