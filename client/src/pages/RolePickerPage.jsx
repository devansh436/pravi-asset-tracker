import { useState } from "react";

import { ROLE_DESCRIPTIONS, ROLES } from "../config/roles";

import { useRole } from "../context/RoleContext";

const ROLE_META = {
  admin: {
    label: "Administrator",
    short: "ADMIN",
    description:
      "Full operational access across assets, inspections, defects and maintenance.",
  },

  inspector: {
    label: "Inspector",
    short: "INSPECTOR",
    description:
      "Inspect infrastructure, record conditions and manage defects.",
  },

  maintenance: {
    label: "Maintenance",
    short: "MAINTENANCE",
    description: "Manage maintenance work, assignments, costs and completion.",
  },

  viewer: {
    label: "Viewer",
    short: "VIEWER",
    description:
      "Read-only access to infrastructure data, maps and operational status.",
  },
};

export function RolePickerPage() {
  const [selected, setSelected] = useState("");

  const { setRole } = useRole();

  const login = () => {
    if (!selected) return;

    setRole(selected);
  };

  const selectedMeta = selected ? ROLE_META[selected] : null;

  return (
    <main className="login-page">
      <div className="login-grid" />

      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />

      <section className="login-layout">
        {/* BRAND / LEFT SIDE */}
        <div className="login-intro">
          <div className="login-brand">
            <div className="login-logo">P</div>

            <div>
              <div className="login-brand-name">PRAVI</div>

              <div className="login-brand-subtitle">ASSET CONTROL</div>
            </div>
          </div>

          <div className="login-kicker">INFRASTRUCTURE OPERATIONS PLATFORM</div>

          <h1>
            Know your
            <br />
            <span>infrastructure.</span>
          </h1>

          <p>
            Monitor assets, inspections, defects and maintenance from a single
            operational control room.
          </p>

          <div className="login-stats">
            <div>
              <strong>01</strong>
              <span>ASSET REGISTER</span>
            </div>

            <div>
              <strong>02</strong>
              <span>LIVE MAP</span>
            </div>

            <div>
              <strong>03</strong>
              <span>MAINTENANCE</span>
            </div>
          </div>
        </div>

        {/* LOGIN CARD */}
        <div className="login-card">
          <div className="login-card-top">
            <div>
              <span className="login-card-kicker">CONTROL ROOM</span>

              <h2>Welcome back</h2>

              <p>Select your operational role to continue.</p>
            </div>

            <div className="demo-pill">DEMO</div>
          </div>

          <div className="login-divider" />

          <div className="role-heading">
            <label>ACCESS ROLE</label>

            {selectedMeta && <span>{selectedMeta.short}</span>}
          </div>

          <div className="role-options">
            {ROLES.map((role) => {
              const meta = ROLE_META[role];

              const active = selected === role;

              return (
                <button
                  type="button"
                  key={role}
                  className={`role-option ${active ? "selected" : ""}`}
                  onClick={() => setSelected(role)}
                >
                  <span className="role-radio">{active && <span />}</span>

                  <span className="role-option-content">
                    <strong>{meta.label}</strong>

                    <small>{meta.description}</small>
                  </span>

                  <span className="role-arrow">→</span>
                </button>
              );
            })}
          </div>

          <button className="login-button" disabled={!selected} onClick={login}>
            <span>Enter control room</span>

            <span className="login-button-arrow">→</span>
          </button>

          <div className="login-security-note">
            <span className="login-status-dot" />
            Hackathon demonstration environment
          </div>
        </div>
      </section>

      <footer className="login-footer">
        <span>PRAVI · INFRASTRUCTURE ASSET MANAGEMENT</span>

        <span>SYSTEM ONLINE</span>
      </footer>
    </main>
  );
}
