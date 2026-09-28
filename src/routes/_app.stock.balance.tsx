import { createFileRoute } from '@tanstack/react-router';
import { Text } from '@mantine/core';
import { useLedgerSummary } from '@/hooks/useStock';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { LedgerSummaryRow } from '@/lib/api/stock';
import { formatNumber } from '@/lib/utils/format';

export const Route = createFileRoute('/_app/stock/balance')({
  component: BalancePage,
});

function BalancePage() {
  const query = useLedgerSummary();

  const columns: Column<LedgerSummaryRow>[] = [
    {
      key: 'item',
      header: 'Item',
      render: (r) => <Text fw={500}>{r.item?.name || '-'}</Text>,
    },
    {
      key: 'code',
      header: 'Code',
      render: (r) => <Text size="sm" c="dimmed">{r.item?.code || '-'}</Text>,
    },
    {
      key: 'model',
      header: 'Model',
      render: (r) => r.stock_item?.stock_model || '-',
    },
    {
      key: 'balance',
      header: 'Balance',
      align: 'right',
      render: (r) => (
        <Text
          fw={600}
          c={r.balance < 0 ? 'red' : r.balance === 0 ? 'dimmed' : 'green'}
        >
          {formatNumber(r.balance, 3)}
        </Text>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Stock Balance"
        subtitle="Current balance per item - sum of all ledger movements"
      />
      <DataTable
        data={query.data ?? []}
        columns={columns}
        loading={query.isLoading}
        error={query.error ? 'Failed to load balance' : null}
        rowKey={(r) => `${r.property_id}:${r.stock_item_id}`}
        emptyTitle="No stock yet"
        emptyDescription="No stock movements have been recorded."
      />
    </>
  );
}