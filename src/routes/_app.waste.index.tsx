import { createFileRoute, Link } from '@tanstack/react-router';
import { Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { useWasteList } from '@/hooks/useOperations';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { CreateWasteModal } from '@/components/waste/CreateWasteModal';
import { WasteRecord } from '@/lib/api/operations';
import { formatCurrency, formatDateTime, formatNumber } from '@/lib/utils/format';

export const Route = createFileRoute('/_app/waste/')({
  component: WastePage,
});

function WastePage() {
  const auth = useAuth();
  const [page, setPage] = useState(1);
  const [open, { open: openModal, close }] = useDisclosure(false);
  const query = useWasteList({ page, limit: 20 });

  const canCreate =
    auth.hasPermission('stock.issue') || auth.hasRole('manager');

  const columns: Column<WasteRecord>[] = [
    {
      key: 'ref',
      header: 'Ref',
      render: (r) => (
        <Link
          to="/waste/$id"
          params={{ id: r.id }}
          style={{ textDecoration: 'none' }}
        >
          <Text c="blue" fw={500}>{r.waste_ref}</Text>
        </Link>
      ),
    },
    {
      key: 'item',
      header: 'Item',
      render: (r) => r.stock_item?.item?.name || '-',
    },
    {
      key: 'qty',
      header: 'Qty',
      align: 'right',
      render: (r) => `${formatNumber(r.quantity, 3)} ${r.unit?.code || ''}`,
    },
    {
      key: 'cost',
      header: 'Cost',
      align: 'right',
      render: (r) => formatCurrency(r.cost_amount),
    },
    { key: 'reason', header: 'Reason', render: (r) => r.reason },
    {
      key: 'when',
      header: 'When',
      render: (r) => formatDateTime(r.recorded_at),
    },
  ];

  return (
    <>
      <PageHeader
        title="Waste Records"
        subtitle="Spoilage, breakage, expired stock"
        actions={
          canCreate ? (
            <Button leftSection={<Plus size={16} />} onClick={openModal}>
              Record Waste
            </Button>
          ) : undefined
        }
      />
      <DataTable
        data={query.data?.data ?? []}
        columns={columns}
        loading={query.isLoading}
        error={query.error ? 'Failed to load waste records' : null}
        rowKey={(r) => r.id}
        meta={query.data?.meta}
        onPageChange={setPage}
        emptyTitle="No waste recorded"
        emptyDescription="Waste records will appear here."
      />
      <CreateWasteModal opened={open} onClose={close} />
    </>
  );
}