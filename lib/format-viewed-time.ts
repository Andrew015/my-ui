export function formatViewedAt(viewedAt: number) {
  const now = new Date();
  const target = new Date(viewedAt);
  const diffMs = now.getTime() - target.getTime();
  const diffMin = Math.floor(diffMs / (60 * 1000));

  if (diffMin < 1) return "刚刚看过";
  if (diffMin < 60) return `${diffMin}分钟前`;

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetDayStart = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  ).getTime();
  const dayDiff = Math.round((todayStart - targetDayStart) / (24 * 60 * 60 * 1000));

  const hh = String(target.getHours()).padStart(2, "0");
  const mm = String(target.getMinutes()).padStart(2, "0");
  if (dayDiff === 0) return `今天 ${hh}:${mm}`;
  if (dayDiff === 1) return `昨天 ${hh}:${mm}`;

  const yyyy = target.getFullYear();
  const mo = String(target.getMonth() + 1).padStart(2, "0");
  const dd = String(target.getDate()).padStart(2, "0");
  return `${yyyy}-${mo}-${dd} ${hh}:${mm}`;
}
