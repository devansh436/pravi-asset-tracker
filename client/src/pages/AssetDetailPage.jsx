import { useState } from "react";
import { useParams } from "react-router-dom";
import { getAsset, getLifecycle, transitionAsset } from "../api/assets";
import { getDefects as fetchDefects } from "../api/defects";
import { getInspections } from "../api/inspections";
import { usePermissions } from "../hooks/usePermissions";
import {
  Badge,
  Condition,
  dateValue,
  Empty,
  ErrorState,
  PageHeader,
  Skeleton,
  statusTone,
  useResource,
} from "../components/feedback";

export function AssetDetailPage() {
  const { can } = usePermissions();
  const { id } = useParams();
  const asset = useResource(() => getAsset(id), [id]);
  const lifecycle = useResource(() => getLifecycle(id), [id]);
  const inspections = useResource(() => getInspections(id), [id]);
  const defects = useResource(() => fetchDefects(id), [id]);
  const [transition, setTransition] = useState("");
  const [saving, setSaving] = useState(false);
  if (asset.loading) return <Skeleton rows={5} />;
  if (asset.error) return <ErrorState {...asset} />;
  const item = asset.data;
  const move = async () => {
    if (!transition) return;
    if (
      transition === "RETIRED" &&
      !window.confirm("Retire this asset? This cannot be undone.")
    )
      return;
    setSaving(true);
    try {
      await transitionAsset(id, {
        toStatus: transition,
        note: "Updated from control room",
      });
      setTransition("");
      asset.retry();
      lifecycle.retry();
    } catch (_error) {
      /* reload exposes the latest state */
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <PageHeader
        eyebrow={`${item.asset_code} / ${item.type}`}
        title={item.name}
      >
        <Badge tone={statusTone(item.status)}>
          {item.status.replaceAll("_", " ")}
        </Badge>
      </PageHeader>
      <div className="detail-grid">
        <section className="card detail-main">
          <div className="detail-score">
            <span>CONDITION SCORE</span>
            <strong>{item.condition_score ?? "—"}</strong>
            <Condition score={item.condition_score} />
          </div>
          <div className="detail-facts">
            <Fact label="Asset code" value={item.asset_code} />
            <Fact
              label="Criticality"
              value={item.criticality ? `${item.criticality} / 5` : "—"}
            />
            <Fact
              label="Coordinates"
              value={`${item.location_lat}, ${item.location_lng}`}
            />
            <Fact label="Expected EOL" value={dateValue(item.expected_eol)} />
          </div>
          <div className="transition-bar">
            <select
              className="select"
              value={transition}
              onChange={(e) => setTransition(e.target.value)}
            >
              <option value="">Change lifecycle status</option>
              <option>UNDER_CONSTRUCTION</option>
              <option>OPERATIONAL</option>
              <option>MAINTENANCE</option>
              <option>RETIRED</option>
            </select>
            {can("EDIT_ASSET") && (
              <button
                className="button button-primary"
                disabled={!transition || saving}
                onClick={move}
              >
                Apply transition
              </button>
            )}
          </div>
        </section>
        <section className="card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">LIFECYCLE</span>
              <h2>History</h2>
            </div>
          </div>
          <Timeline events={lifecycle.data || []} />
        </section>
      </div>
      <div className="detail-grid lower">
        <section className="card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">INSPECTIONS</span>
              <h2>Condition checks</h2>
            </div>
          </div>
          {inspections.loading ? (
            <Skeleton rows={2} />
          ) : inspections.error ? (
            <ErrorState {...inspections} />
          ) : (
            <SimpleRows
              items={inspections.data || []}
              primary="condition_score"
              secondary="inspection_date"
            />
          )}
        </section>
        <section className="card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">DEFECTS</span>
              <h2>Reported issues</h2>
            </div>
          </div>
          {defects.loading ? (
            <Skeleton rows={2} />
          ) : defects.error ? (
            <ErrorState {...defects} />
          ) : (
            <SimpleRows
              items={defects.data || []}
              primary="type"
              secondary="severity"
            />
          )}
        </section>
      </div>
    </>
  );
}
function Fact({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function Timeline({ events }) {
  if (!events.length) return <Empty title="No lifecycle events" />;
  return (
    <div className="timeline">
      {events.map((event) => (
        <div className="timeline-row" key={event.id}>
          <i />
          <div>
            <strong>{event.to_status.replaceAll("_", " ")}</strong>
            <small>
              {event.reason || "Status recorded"} ·{" "}
              {dateValue(event.event_time)}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
function SimpleRows({ items, primary, secondary }) {
  if (!items.length) return <Empty title="No records yet" />;
  return (
    <div className="simple-rows">
      {items.map((item) => (
        <div key={item.id}>
          <strong>
            {primary === "condition_score" ? (
              <Condition score={item[primary]} />
            ) : (
              item[primary]
            )}
          </strong>
          <small>
            {secondary === "inspection_date"
              ? dateValue(item[secondary])
              : item[secondary]}
          </small>
        </div>
      ))}
    </div>
  );
}
