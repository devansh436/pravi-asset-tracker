import { Empty } from "../feedback";

export function MaintenanceList({ items = [] }) {
  if (!items.length) return <Empty title="No active jobs" />;
  return <div className="maintenance-list">{items.map((item) => <div className="maintenance-row" key={item.id}><span className="priority-mark" /><div><strong>{item.title}</strong><small>{item.status} · {item.priority} priority</small></div><span className="mono">{item.asset_id.slice(-6)}</span></div>)}</div>;
}
