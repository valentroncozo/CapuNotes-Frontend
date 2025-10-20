// parsea 'YYYY-MM-DD' -> Date local 00:00
function parseInputDate(str) {
  if (!str) return null;
  const [y, m, d] = String(str).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

// devuelve array de Date (cada elemento es new Date(...))
function getDateRangeDates(startStr, endStr, { maxDays = 10000 } = {}) {
  const start = parseInputDate(startStr);
  const end = parseInputDate(endStr);
  if (!start || !end) return [];
  let from = start, to = end;
  if (from > to) [from, to] = [to, from];
  const diffDays = Math.round((to - from) / (24 * 60 * 60 * 1000));
  if (diffDays > maxDays) throw new Error(`Rango demasiado grande (${diffDays} días).`);
  const out = [];
  for (let i = 0; i <= diffDays; i++) {
    out.push(new Date(from.getFullYear(), from.getMonth(), from.getDate() + i));
  }
  return out;
}

// formatea Date -> 'DD-MM-YYYY'
function formatDDMMYYYY(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

// Exportaciones
export { formatDDMMYYYY };
export default getDateRangeDates;