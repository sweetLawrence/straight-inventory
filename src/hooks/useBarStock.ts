import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getBarMovements, getBarStock } from '@/lib/api/barStock';

// Refreshes often so each drink drops as soon as the bar issues it
export function useBarStock(params: { from?: string; to?: string; property_id?: string } = {}) {
  return useQuery({
    queryKey: ['bar-stock', 'overview', params],
    queryFn: () => getBarStock(params),
    placeholderData: keepPreviousData,
    refetchInterval: 15_000,
  });
}

export function useBarMovements(id: string | null) {
  return useQuery({
    queryKey: ['bar-stock', 'movements', id],
    queryFn: () => getBarMovements(id as string),
    enabled: !!id,
    refetchInterval: 15_000,
  });
}
