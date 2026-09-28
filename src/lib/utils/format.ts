import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return 'KES 0.00';
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return 'KES 0.00';
  return `KES ${n.toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNumber(value: number | string | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) return '0';
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return '0';
  return n.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '-';
  return dayjs(value).format('DD MMM YYYY');
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '-';
  return dayjs(value).format('DD MMM YYYY, HH:mm');
}

export function formatRelative(value: string | Date | null | undefined): string {
  if (!value) return '-';
  return dayjs(value).fromNow();
}