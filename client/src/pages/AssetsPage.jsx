import { useState } from "react";
import { getAssets } from "../api/assets";
import { AssetForm } from "../components/assets/AssetForm";
import { AssetTable } from "../components/assets/AssetTable";
import { usePermissions } from "../hooks/usePermissions";

import {
  ErrorState,
  PageHeader,
  Skeleton,
  useResource,
} from "../components/feedback";

export function AssetsPage() {
  const { can } = usePermissions();
  const params = new URLSearchParams(window.location.search);
  const [filters, setFilters] = useState({
    search: params.get("search") || "",
    type: "",
    status: "",
  });
  const [showForm, setShowForm] = useState(false);
  const resource = useResource(
    () => getAssets(filters),
    [filters.search, filters.type, filters.status],
  );
  return (
    <>
      <PageHeader eyebrow="INVENTORY / ASSETS" title="Asset register">
        {can("CREATE_ASSET") && (
          <button
            className="button button-primary"
            onClick={() => setShowForm(true)}
          >
            ＋ Register asset
          </button>
        )}
      </PageHeader>
      <div className="filter-row">
        <input
          className="input"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search code or name"
        />
        <select
          className="select"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All types</option>
          <option>ROAD</option>
          <option>BRIDGE</option>
          <option>BUILDING</option>
        </select>
        <select
          className="select"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All statuses</option>
          <option>PLANNED</option>
          <option>UNDER_CONSTRUCTION</option>
          <option>OPERATIONAL</option>
          <option>MAINTENANCE</option>
          <option>RETIRED</option>
        </select>
        <span className="filter-count">
          {resource.data?.length ?? "—"} records
        </span>
      </div>
      {resource.loading ? (
        <Skeleton />
      ) : resource.error ? (
        <ErrorState {...resource} />
      ) : (
        <section className="card">
          <AssetTable assets={resource.data} />
        </section>
      )}
      {showForm && (
        <AssetForm
          onClose={() => setShowForm(false)}
          onSaved={resource.retry}
        />
      )}
    </>
  );
}
