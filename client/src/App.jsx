import { BrowserRouter, Route, Routes } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { AppShell } from "./components/layout/AppShell";
import { OverviewPage } from "./pages/OverviewPage";
import { AssetsPage } from "./pages/AssetsPage";
import { AssetDetailPage } from "./pages/AssetDetailPage";
import { MapPage } from "./pages/MapPage";
import { InspectionsPage } from "./pages/InspectionsPage";
import { MaintenancePage } from "./pages/MaintenancePage";
import { AlertsPage } from "./pages/AlertsPage";
import "./App.css";

export default function App() {
  return <BrowserRouter><AppShell><Routes><Route path="/" element={<OverviewPage />} /><Route path="/assets" element={<AssetsPage />} /><Route path="/assets/:id" element={<AssetDetailPage />} /><Route path="/map" element={<MapPage />} /><Route path="/inspections" element={<InspectionsPage />} /><Route path="/maintenance" element={<MaintenancePage />} /><Route path="/alerts" element={<AlertsPage />} /><Route path="*" element={<OverviewPage />} /></Routes></AppShell></BrowserRouter>;
}
