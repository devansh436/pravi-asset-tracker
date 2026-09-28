import { NavLink } from "react-router-dom";
import { Badge, Condition, Empty, statusTone } from "../feedback";

export function AssetTable({ assets = [] }) {
  if (!assets.length) return <Empty title="No assets in this view" />;
  return <div className="asset-table"><div className="table-head"><span>Asset</span><span>Type</span><span>Status</span><span>Condition</span></div>{assets.map((asset) => <NavLink to={`/assets/${asset.id}`} className="table-row" key={asset.id}><span><strong>{asset.asset_code}</strong><small>{asset.name}</small></span><span>{asset.type}</span><span><Badge tone={statusTone(asset.status)}>{asset.status.replaceAll("_", " ")}</Badge></span><Condition score={asset.condition_score} /></NavLink>)}</div>;
}
