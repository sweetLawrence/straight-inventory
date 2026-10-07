import { apiClient, ApiResponse } from './client';

export interface BarDrink {
  id: string;
  code: string;
  name: string;
  property: string;
  unit: string | null;
  stock_model: string;
  reorder_level: number | null;
  pack_size: number | null;
  pack_label: string | null;
  opening: number;
  received: number;
  sold: number;
  waste: number;
  other: number;
  /** Count right now (or at the end of a past period) */
  balance: number;
  closing: number;
  revenue: number;
  unit_cost: number;
  value: number;
  status: 'ok' | 'low' | 'out';
  last_sold_at: string | null;
  last_movement_at: string | null;
}

export interface BarStockOverview {
  period: { from: string; to: string; is_today: boolean; start: string; end: string };
  summary: {
    drinks: number;
    sold: number;
    revenue: number;
    received: number;
    waste: number;
    value: number;
    low: number;
    out: number;
  };
  drinks: BarDrink[];
}

export interface BarMovement {
  id: string;
  at: string;
  type: string;
  label: string;
  change: number;
  balance_after: number;
  by: string | null;
  batch_ref: string | null;
  order_ref: string | null;
  table_number: string | null;
  waiter: string | null;
  menu_item: string | null;
  reason: string | null;
}

export interface BarMovements {
  drink: { id: string; name: string; code: string; pack_size: number | null; pack_label: string | null };
  rows: BarMovement[];
}

export async function getBarStock(params: { from?: string; to?: string; property_id?: string }) {
  const res = await apiClient.get<ApiResponse<BarStockOverview>>('/bar/stock', { params });
  return res.data.data;
}

export async function getBarMovements(id: string, limit = 50) {
  const res = await apiClient.get<ApiResponse<BarMovements>>(`/bar/stock/${id}/movements`, {
    params: { limit },
  });
  return res.data.data;
}
