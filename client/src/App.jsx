import { BrowserRouter, Route, Routes } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import { RoleProvider, useRole } from "./context/RoleContext";
import { AppShell } from "./components/layout/AppShell";

import { RolePickerPage } from "./pages/RolePickerPage";
import { OverviewPage } from "./pages/OverviewPage";
import { AssetsPage } from "./pages/AssetsPage";
import { AssetDetailPage } from "./pages/AssetDetailPage";
import { MapPage } from "./pages/MapPage";
import { InspectionsPage } from "./pages/InspectionsPage";
import { MaintenancePage } from "./pages/MaintenancePage";
import { AlertsPage } from "./pages/AlertsPage";

import "./App.css";

function ProtectedApp() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<OverviewPage />} />

        <Route path="/assets" element={<AssetsPage />} />

        <Route path="/assets/:id" element={<AssetDetailPage />} />

        <Route path="/map" element={<MapPage />} />

        <Route path="/inspections" element={<InspectionsPage />} />

        <Route path="/maintenance" element={<MaintenancePage />} />

        <Route path="/alerts" element={<AlertsPage />} />

        <Route path="*" element={<OverviewPage />} />
      </Routes>
    </AppShell>
  );
}

function RoleGate() {
  // IMPORTANT:
  // Read role from React state, not directly from sessionStorage.
  const { role } = useRole();

  if (!role) {
    return <RolePickerPage />;
  }

  return <ProtectedApp />;
}

export default function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <RoleGate />
      </RoleProvider>
    </BrowserRouter>
  );
}
