import { pool } from "../db/pool.js";

export async function getDashboard() {
  const [totalAssets, countsByType, countsByStatus, averageCondition, lowConditionAssets, openDefectCount, openDefects, activeMaintenanceCount, activeMaintenance, criticalAssets, upcomingEol] = await Promise.all([
    pool.query("SELECT COUNT(*)::int AS count FROM assets"),
    pool.query("SELECT type, COUNT(*)::int AS count FROM assets GROUP BY type ORDER BY type"),
    pool.query("SELECT status, COUNT(*)::int AS count FROM assets GROUP BY status ORDER BY status"),
    pool.query("SELECT COALESCE(ROUND(AVG(condition_score), 1), 0)::numeric AS average FROM assets WHERE condition_score IS NOT NULL"),
    pool.query("SELECT * FROM assets WHERE condition_score < 40 ORDER BY condition_score ASC, asset_code ASC LIMIT 10"),
    pool.query("SELECT COUNT(*)::int AS count FROM defects WHERE status = 'OPEN'"),
    pool.query("SELECT * FROM defects WHERE status = 'OPEN' ORDER BY created_at DESC LIMIT 10"),
    pool.query("SELECT COUNT(*)::int AS count FROM maintenance WHERE status IN ('OPEN', 'ASSIGNED', 'IN_PROGRESS')"),
    pool.query("SELECT * FROM maintenance WHERE status IN ('OPEN', 'ASSIGNED', 'IN_PROGRESS') ORDER BY created_at DESC LIMIT 10"),
    pool.query("SELECT * FROM assets WHERE criticality IS NOT NULL ORDER BY criticality DESC, asset_code ASC LIMIT 10"),
    pool.query("SELECT * FROM assets WHERE expected_eol BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '365 days' ORDER BY expected_eol ASC LIMIT 10"),
  ]);

  return {
    totalAssets: totalAssets.rows[0].count,
    countsByType: countsByType.rows,
    countsByStatus: countsByStatus.rows,
    averageCondition: averageCondition.rows[0].average,
    lowConditionAssets: lowConditionAssets.rows,
    openDefects: { count: openDefectCount.rows[0].count, latest: openDefects.rows },
    activeMaintenance: { count: activeMaintenanceCount.rows[0].count, list: activeMaintenance.rows },
    criticalAssets: criticalAssets.rows,
    upcomingEol: upcomingEol.rows,
  };
}