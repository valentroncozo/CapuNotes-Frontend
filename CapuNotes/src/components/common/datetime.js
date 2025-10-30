export const pad2 = (n) => String(n).padStart(2, '0');
export const formatHHmm = (date) => `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
export const horaToMinutes = (hhmm) => {
  const [h, m] = String(hhmm || '0:0').split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

