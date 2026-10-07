import { createFileRoute } from '@tanstack/react-router';
import { Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useFloat } from '@/hooks/usePayments';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatBadge } from '@/components/StatBadge';
import { FloatEntryModal } from '@/components/payments/FloatEntryModal';
import { FloatEntry } from '@/lib/api/payments';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { getErrorMessage } from '@/lib/api/client'
import { useAuth } from '@/lib/auth/useAuth'

export const Route = createFileRoute('/_app/float')({
  component: FloatPage,
});

function FloatPage() {
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const query = useFloat({ page, limit: 20 });
  const canRecord = useAuth().hasPermission('cash.drop.verify');

  const columns: Column<FloatEntry>[] = [
    {
      key: 'recorded_at',
      header: 'When',
      render: (r) => <span style={{ whiteSpace: 'nowrap' }}>{formatDateTime(r.recorded_at)}</span>,
    },
    {
      key: 'waiter',
      header: 'Waiter',
      render: (r) => r.waiter?.full_name || '-',
    },
    {
      key: 'event_type',
      header: 'Event',
      render: (r) => <StatBadge value={r.event_type} />,
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (r) => <Text fw={500}>{formatCurrency(r.amount)}</Text>,
    },
    {
      key: 'recorded_by',
      header: 'Recorded By',
      render: (r) => r.recorded_by_user?.full_name || '-',
    },
  ];

  return (
    <>
      <PageHeader
        title="Float Ledger"
        subtitle={canRecord ? 'Issued, returned, and topped-up float' : 'Float the cashier gave you and took back'}
        actions={
          canRecord && (
            <Button leftSection={<Plus size={16} />} onClick={open}>
              New Entry
            </Button>
          )
        }
      />
      <DataTable
        data={query.data?.data ?? []}
        columns={columns}
        loading={query.isLoading}
        error={query.error ? getErrorMessage(query.error, 'Failed to load float') : null}
        rowKey={(r) => r.id}
        groupByDate={(r) => r.recorded_at}
        meta={query.data?.meta}
        onPageChange={setPage}
        emptyTitle="No float entries"
        emptyDescription="Float issued to waiters will appear here."
      />
      <FloatEntryModal opened={opened} onClose={close} />
    </>
  );
}