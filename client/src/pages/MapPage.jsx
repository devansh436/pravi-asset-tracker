import { MapContainer, CircleMarker, Popup, TileLayer } from "react-leaflet";
import { getAssets } from "../api/assets";
import { ErrorState, PageHeader, Skeleton, useResource } from "../components/feedback";

export function MapPage() {
  const resource = useResource(getAssets, []);
  if (resource.loading) return <Skeleton rows={6} />;
  if (resource.error) return <ErrorState {...resource} />;
  const assets = resource.data.filter((item) => item.location_lat && item.location_lng);
  return <><PageHeader eyebrow="GIS / SPATIAL VIEW" title="Asset map"><span className="muted">{assets.length} mapped assets</span></PageHeader><section className="card map-card"><MapContainer center={[22.8, 79.2]} zoom={5} scrollWheelZoom><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{assets.map((asset) => <CircleMarker key={asset.id} center={[Number(asset.location_lat), Number(asset.location_lng)]} radius={7} pathOptions={{ color: markerColor(asset.status), fillColor: markerColor(asset.status), fillOpacity: 0.8 }}><Popup><strong>{asset.asset_code}</strong><br />{asset.name}<br />{asset.status}</Popup></CircleMarker>)}</MapContainer></section></>;
}

function markerColor(status) { return status === "OPERATIONAL" ? "#37d39b" : status === "MAINTENANCE" ? "#f1bd5b" : status === "RETIRED" ? "#8293a5" : "#38bdf8"; }
