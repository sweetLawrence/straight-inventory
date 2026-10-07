import type { ListFilters } from './listFilters';
import { apiClient, ApiResponse, PaginatedResponse } from './client';

// ─── Payments ───────────────────────────────────────────────────────
export interface PaymentLine {
  id: string;
  payment_id: string;
  method: 'cash' | 'mpesa' | 'card' | 'other';
  amount: string;
  transaction_ref: string | null;
  verification_status: 'pending' | 'verified' | 'unverified' | 'failed' | 'disputed';
  verified_by: string | null;
  verified_at: string | null;
  verification_notes: string | null;
  verified_by_user?: { id: string; full_name: string };
  cash_drop_lines?: Array<{
    id: string;
    cash_drop: { id: string; drop_ref: string; dropped_at: string };
  }>;
}

export interface Payment {
  id: string;
  payment_ref: string;
  bill_id: string;
  property_id: string;
  business_day_id: string;
  shift_id: string;
  waiter_id: string;
  total_amount: string;
  status: 'pending' | 'partially_verified' | 'verified' | 'disputed';
  created_at: string;
  waiter?: { id: string; full_name: string; username: string };
  bill?: {
    id: string;
    bill_ref: string;
    customer_code: string;
    net_total: string;
    status: string;
  };
  payment_lines?: PaymentLine[];
}

export async function listPayments(params?: ListFilters & {
  page?: number;
  limit?: number;
  bill_id?: string;
  waiter_id?: string;
  status?: string;
  business_day_id?: string;
}) {
  const res = await apiClient.get<PaginatedResponse<Payment>>('/payments', {
    params,
  });
  return res.data;
}

export async function getPayment(id: string) {
  const res = await apiClient.get<ApiResponse<Payment>>(`/payments/${id}`);
  return res.data.data;
}

export interface CreatePaymentData {
  bill_id: string;
  payment_lines: Array<{
    method: 'cash' | 'mpesa' | 'card' | 'other';
    amount: number;
    transaction_ref?: string;
  }>;
}

export async function createPayment(data: CreatePaymentData) {
  const res = await apiClient.post<ApiResponse<Payment>>('/payments', data);
  return res.data.data;
}

// ─── Pending verification ──────────────────────────────────────────
export interface PendingPaymentLine {
  id: string;
  payment_id: string;
  method: 'cash' | 'mpesa' | 'card' | 'other';
  amount: string;
  transaction_ref: string | null;
  verification_status: string;
  created_at: string;
  payment?: {
    id: string;
    payment_ref: string;
    property_id: string;
    waiter?: { id: string; full_name: string; username: string };
    bill?: { id: string; bill_ref: string; customer_code: string };
  };
}

export async function listPendingVerification(params?: {
  page?: number;
  limit?: number;
  method?: string;
}) {
  const res = await apiClient.get<PaginatedResponse<PendingPaymentLine>>(
    '/payments/pending-verification',
    { params }
  );
  return res.data;
}

export async function verifyPaymentLine(
  lineId: string,
  data: {
    verification_status: 'verified' | 'unverified' | 'failed';
    verification_notes?: string;
  }
) {
  const res = await apiClient.post<ApiResponse<PaymentLine>>(
    `/payment-lines/${lineId}/verify`,
    data
  );
  return res.data.data;
}

// ─── Cash Drops ─────────────────────────────────────────────────────
export interface CashDropLine {
  id: string;
  cash_drop_id: string;
  bill_id: string;
  payment_line_id: string;
  amount: string;
  bill?: { id: string; bill_ref: string; customer_code: string };
  payment_line?: PaymentLine;
}

export interface CashDrop {
  id: string;
  drop_ref: string;
  waiter_id: string;
  receiver_id: string;
  receiver_role: 'cashier' | 'supervisor' | 'manager';
  property_id: string;
  business_day_id: string;
  shift_id: string;
  total_amount: string;
  dropped_at: string;
  verified_at: string | null;
  status: 'pending' | 'verified' | 'disputed';
  notes: string | null;
  waiter?: { id: string; full_name: string; username: string };
  receiver?: { id: string; full_name: string; username: string };
  cash_drop_lines?: CashDropLine[];
}

export async function listCashDrops(params?: ListFilters & {
  page?: number;
  limit?: number;
  waiter_id?: string;
  status?: string;
}) {
  const res = await apiClient.get<PaginatedResponse<CashDrop>>('/cash-drops', {
    params,
  });
  return res.data;
}

export async function getCashDrop(id: string) {
  const res = await apiClient.get<ApiResponse<CashDrop>>(`/cash-drops/${id}`);
  return res.data.data;
}

export async function createCashDrop(data: {
  receiver_id?: string;
  receiver_role?: 'cashier' | 'supervisor' | 'manager';
  notes?: string;
  cash_drop_lines: Array<{
    bill_id: string;
    payment_line_id: string;
    amount: number;
  }>;
}) {
  const res = await apiClient.post<ApiResponse<CashDrop>>('/cash-drops', data);
  return res.data.data;
}



export async function listPendingCashDrops(params?: {
  page?: number;
  limit?: number;
}) {
  const res = await apiClient.get<PaginatedResponse<CashDrop>>(
    '/cash-drops/pending',
    { params }
  );
  return res.data;
}

export async function confirmCashDrop(
  id: string,
  data: { receiver_role?: 'cashier' | 'supervisor' | 'manager'; notes?: string }
) {
  const res = await apiClient.post<ApiResponse<CashDrop>>(
    `/cash-drops/${id}/confirm`,
    data
  );
  return res.data.data;
}

export async function rejectCashDrop(id: string, data: { reason: string }) {
  const res = await apiClient.post<ApiResponse<CashDrop>>(
    `/cash-drops/${id}/reject`,
    data
  );
  return res.data.data;
}





// ─── Float ──────────────────────────────────────────────────────────
export interface FloatEntry {
  id: string;
  waiter_id: string;
  property_id: string;
  business_day_id: string;
  shift_id: string;
  event_type: 'issued' | 'returned' | 'top_up';
  amount: string;
  recorded_by: string;
  recorded_at: string;
  notes: string | null;
  waiter?: { id: string; full_name: string; username: string };
  recorded_by_user?: { id: string; full_name: string };
}

export async function listFloat(params?: {
  page?: number;
  limit?: number;
  waiter_id?: string;
  event_type?: string;
}) {
  const res = await apiClient.get<PaginatedResponse<FloatEntry>>(
    '/float-ledger',
    { params }
  );
  return res.data;
}

export async function createFloat(data: {
  waiter_id?: string;
  event_type: 'issued' | 'returned' | 'top_up';
  amount: number;
  notes?: string;
}) {
  const res = await apiClient.post<ApiResponse<FloatEntry>>(
    '/float-ledger',
    data
  );
  return res.data.data;
}

// ─── Handover ───────────────────────────────────────────────────────
export interface Handover {
  waiter_id: string;
  shift_id: string;
  property_id: string;
  total_bills: number;
  total_bills_count: number;
  totals_by_method: {
    cash: number;
    mpesa: number;
    card: number;
    other: number;
  };
  status_by_method: Record<
    string,
    { pending: number; verified: number; unverified: number; failed: number }
  >;
  cash_dropped: number;
  cash_pending: number;
  float_issued: number;
  float_returned: number;
  float_net: number;
  drops_count: number;
  /** The shift these figures cover */
  shift?: { id: string; name: string; code: string; opened_at: string; closed_at: string | null; status: string } | null;
  /** waiter = your own bills; outlet = the whole bar */
  scope?: 'waiter' | 'outlet';
  as_of?: string;
  /** Previous shift asked for, but this property has had no shift before the current one */
  no_previous?: boolean;
}

/** 'previous' = the shift before the one running now (e.g. last night after 06:00) */
export async function getCurrentHandover(which: 'current' | 'previous' = 'current') {
  const res = await apiClient.get<ApiResponse<Handover>>('/handovers/current', {
    params: which === 'previous' ? { shift: 'previous' } : undefined,
  });
  return res.data.data;
}

export async function getHandover(waiterId: string, shiftId: string) {
  const res = await apiClient.get<ApiResponse<Handover>>(
    `/handovers/${waiterId}/${shiftId}`
  );
  return res.data.data;
}