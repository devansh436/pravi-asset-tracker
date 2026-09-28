import { useEffect, useState } from "react";
import { conditionBand } from "../utils/condition";

export function useResource(loader, dependencies = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const load = () => { setState({ data: null, loading: true, error: null }); loader().then((data) => setState({ data, loading: false, error: null })).catch((error) => setState({ data: null, loading: false, error })); };
  useEffect(load, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
  return { ...state, retry: load };
}

export function Badge({ children, tone = "info" }) { return <span className={`badge badge-${tone}`}>{children}</span>; }
export function Condition({ score }) { const band = conditionBand(score === null ? null : Number(score)); return <span className="condition"><strong className={`condition-dot dot-${band.tone}`} />{score === null || score === undefined ? "—" : `${score}`} <small>{band.label}</small></span>; }
export function Skeleton({ rows = 4 }) { return <div className="skeleton-list">{Array.from({ length: rows }, (_, index) => <div className="skeleton" key={index} />)}</div>; }
export function Empty({ title, action, onAction }) { return <div className="empty"><span className="empty-mark">∅</span><strong>{title}</strong>{action && <button className="button button-ghost" onClick={onAction}>{action}</button>}</div>; }
export function ErrorState({ error, retry }) { return <div className="inline-error"><strong>Could not load this view</strong><span>{error?.message || "Try again."}</span><button className="button button-ghost" onClick={retry}>Retry</button></div>; }
export function PageHeader({ eyebrow, title, children }) { return <div className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>{children}</div>; }
export function statusTone(status) { return status === "OPERATIONAL" || status === "COMPLETED" ? "success" : status === "MAINTENANCE" || status === "IN_PROGRESS" ? "warning" : status === "RETIRED" ? "muted" : "info"; }
export function dateValue(value) { return value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"; }
