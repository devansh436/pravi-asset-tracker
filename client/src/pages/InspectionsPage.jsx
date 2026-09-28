import { useState } from "react";
import { getAssets } from "../api/assets";
import { createInspection, getInspections } from "../api/inspections";
import {
  Badge,
  ErrorState,
  PageHeader,
  Skeleton,
  useResource,
} from "../components/feedback";

export function InspectionsPage() {
  const assets = useResource(getAssets, []);
  const [assetId, setAssetId] = useState("");
  const inspections = useResource(
    () => (assetId ? getInspections(assetId) : Promise.resolve([])),
    [assetId],
  );
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createInspection(assetId, {
        condition_score: Number(score),
        notes,
      });
      setScore("");
      setNotes("");
      inspections.retry();
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <PageHeader eyebrow="FIELD DATA / INSPECTIONS" title="Condition checks">
        <Badge tone="info">Schema range 0–100</Badge>
      </PageHeader>
      <div className="split-layout">
        <section className="card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">NEW INSPECTION</span>
              <h2>Record condition</h2>
            </div>
          </div>
          {assets.loading ? (
            <Skeleton rows={3} />
          ) : assets.error ? (
            <ErrorState {...assets} />
          ) : (
            <form className="form-stack" onSubmit={submit}>
              <label>
                Asset
                <select
                  className="select"
                  required
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                >
                  <option value="">Select asset</option>
                  {assets.data.map((asset) => (
                    <option value={asset.id} key={asset.id}>
                      {asset.asset_code} · {asset.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Condition score
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </label>
              <label>
                Notes
                <textarea
                  className="textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="4"
                />
              </label>
              <button
                className="button button-primary"
                disabled={saving || !assetId}
              >
                {saving ? "Saving..." : "Save inspection"}
              </button>
            </form>
          )}
        </section>
        <section className="card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">HISTORY</span>
              <h2>{assetId ? "Asset inspections" : "Select an asset"}</h2>
            </div>
          </div>
          {inspections.loading ? (
            <Skeleton rows={3} />
          ) : inspections.error ? (
            <ErrorState {...inspections} />
          ) : (
            <SimpleRows items={inspections.data} />
          )}
        </section>
      </div>
    </>
  );
}
function SimpleRows({ items }) {
  if (!items.length)
    return (
      <div className="empty">
        <strong>No records yet</strong>
      </div>
    );
  return (
    <div className="simple-rows">
      {items.map((item) => (
        <div key={item.id}>
          <strong>{item.condition_score}</strong>
          <small>
            {new Date(item.inspection_date).toLocaleDateString("en-IN")}
          </small>
        </div>
      ))}
    </div>
  );
}
