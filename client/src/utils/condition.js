export const conditionBand = (score) => {
  if (score === null || score === undefined) return { label: "Unrated", tone: "muted" };
  if (score >= 70) return { label: "Good", tone: "success" };
  if (score >= 40) return { label: "Fair", tone: "warning" };
  if (score >= 20) return { label: "Poor", tone: "danger" };
  return { label: "Critical", tone: "critical" };
};

// Schema range is 0-100: Good >=70, Fair 40-69, Poor 20-39, Critical <20.