import { apiClient, ApiResponse, PaginatedResponse } from './client';
import { Property } from './core';

// ─── Date range helpers ─────────────────────────────────────────────
export type DatePreset =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'thisMonth'
  | 'custom';

export interface DateRange {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
}

// ─── Aggregation input types (raw data from list endpoints) ─────────
export interface BillSummary {
  id: string;
  bill_ref: string;
  property_id: string;
  net_total: string;
  gross_total: string;
  discount_total: string;
  status: string;
  waiter_id: string;
  business_day_id: string;
  created_at: string;
  waiter?: { id: string; full_name: string; username: string };
  property?: { id: string; code: string; name: string };
}

export interface PaymentSummary {
  id: string;
  payment_ref: string;
  property_id: string;
  total_amount: string;
  status: string;
  business_day_id: string;
  created_at: string;
  payment_lines?: Array<{
    id: string;
    method: 'cash' | 'mpesa' | 'card' | 'other';
    amount: string;
    verification_status: string;
  }>;
}

export interface ExceptionSummary {
  id: string;
  exception_ref: string;
  property_id: string;
  severity: string;
  status: string;
  exception_type: string;
  amount: string | null;
  created_at: string;
}

// ─── Fetchers with filters ─────────────────────────────────────────
export async function fetchBillsInRange(params: {
  from: string;
  to: string;
  property_id?: string;
  page?: number;
  limit?: number;
}) {
  // Backend supports business_day_id filter, not date range directly.
  // We fetch with a high limit and filter client-side by created_at.
  const res = await apiClient.get<PaginatedResponse<BillSummary>>('/bills', {
    params: {
      property_id: params.property_id,
      limit: params.limit || 500,
      page: params.page || 1,
    },
  });
  const data = res.data.data.filter((b) => {
    const d = b.created_at.slice(0, 10);
    return d >= params.from && d <= params.to;
  });
  return data;
}

export async function fetchPaymentsInRange(params: {
  from: string;
  to: string;
  property_id?: string;
}) {
  const res = await apiClient.get<PaginatedResponse<PaymentSummary>>(
    '/payments',
    {
      params: {
        property_id: params.property_id,
        limit: 500,
      },
    }
  );
  return res.data.data.filter((p) => {
    const d = p.created_at.slice(0, 10);
    return d >= params.from && d <= params.to;
  });
}

export async function fetchExceptionsInRange(params: {
  from: string;
  to: string;
  property_id?: string;
}) {
  const res = await apiClient.get<PaginatedResponse<ExceptionSummary>>(
    '/exceptions',
    {
      params: {
        property_id: params.property_id,
        limit: 500,
      },
    }
  );
  return res.data.data.filter((e) => {
    const d = e.created_at.slice(0, 10);
    return d >= params.from && d <= params.to;
  });
}

export async function fetchPropertiesList() {
  const res = await apiClient.get<PaginatedResponse<Property>>('/properties', {
    params: { limit: 50 },
  });
  return res.data.data;
}