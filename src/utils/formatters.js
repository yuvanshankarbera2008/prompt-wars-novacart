/**
 * Utility functions for Indian Number Formatting & Currency
 */

export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Math.round(Number(amount));
  return '₹' + num.toLocaleString('en-IN');
}

export function formatLakhs(amount) {
  if (!amount && amount !== 0) return '₹0';
  const val = Number(amount);
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(1).replace(/\.0$/, '')}L`;
  }
  return formatINR(val);
}

export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

export function formatTimeRange(minMinutes, maxMinutes) {
  return `${minMinutes}–${maxMinutes} min`;
}
