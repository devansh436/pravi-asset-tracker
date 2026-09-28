import { useState } from "react";
import { getMaintenance, updateMaintenance } from "../api/maintenance";
import {
  Badge,
  Empty,
  ErrorState,
  PageHeader,
  Skeleton,
  statusTone,
  useResource,
  dateValue,
} from "../components/feedback";

export function MaintenancePage() {
  const resource = useResource(getMaintenance, []);
  const [filter, setFilter] = useState("");
  const update = async (id, status) => {
    await updateMaintenance(id, { status });
    resource.retry();
  };
  return (
    <>
      <PageHeader eyebrow="WORK ORDERS / MAINTENANCE" title="Maintenance board">
        <select
          className="select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All work</option>
          <option>OPEN</option>
          <option>ASSIGNED</option>
          <option>IN_PROGRESS</option>
          <option>COMPLETED</option>
        </select>
      </PageHeader>
      {resource.loading ? (
        <Skeleton rows={6} />
      ) : resource.error ? (
        <ErrorState {...resource} />
      ) : (
        <section className="card">
          <div className="maintenance-board">
            {resource.data
              .filter((item) => !filter || item.status === filter)
              .map((item) => (
                <article className="work-card" key={item.id}>
                  <div className="work-top">
                    <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                    <span className="priority-text">{item.priority}</span>
                  </div>
                  <h2>{item.title}</h2>
                  <p>{item.description || "No description provided."}</p>
                  <div className="work-meta">
                    <span>
                      Asset <strong>{item.asset_id.slice(-8)}</strong>
                    </span>
                    <span>
                      Due <strong>{dateValue(item.scheduled_date)}</strong>
                    </span>
                  </div>
                  {item.status !== "COMPLETED" && (
                    <select
                      className="select"
                      value=""
                      onChange={(e) =>
                        e.target.value && update(item.id, e.target.value)
                      }
                    >
                      <option value="">Advance status...</option>
                      {nextStatuses(item.status).map((status) => (
                        <option value={status} key={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  )}
                </article>
              ))}
            {!resource.data.length && (
              <Empty
                title="No maintenance jobs"
                action="Reset filters"
                onAction={() => setFilter("")}
              />
            )}
          </div>
        </section>
      )}
    </>
  );
}
function nextStatuses(status) {
  return (
    {
      OPEN: ["ASSIGNED"],
      ASSIGNED: ["IN_PROGRESS"],
      IN_PROGRESS: ["COMPLETED"],
    }[status] || []
  );
}
