// import { createFileRoute, Link } from '@tanstack/react-router';
// import { Button, Group, Text } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
// import { Check, Plus, X } from 'lucide-react';
// import { useState } from 'react';
// import { useAuth } from '@/lib/auth/useAuth';
// import { useCashDrops } from '@/hooks/usePayments';
// import { PageHeader } from '@/components/PageHeader';
// import { DataTable, Column } from '@/components/DataTable';
// import { StatBadge } from '@/components/StatBadge';
// import { RecordCashDropModal } from '@/components/payments/RecordCashDropModal';
// import { ConfirmCashDropModal } from '@/components/payments/ConfirmCashDropModal';
// import { RejectCashDropModal } from '@/components/payments/RejectCashDropModal';
// import { CashDrop } from '@/lib/api/payments';
// import { formatCurrency, formatDateTime } from '@/lib/utils/format';

// export const Route = createFileRoute('/_app/cash-drops/')({
//   component: CashDropsPage,
// });

// function CashDropsPage() {
//   const auth = useAuth();
//   const [page, setPage] = useState(1);
//   const [createOpen, { open: openCreate, close: closeCreate }] =
//     useDisclosure(false);
//   const [confirmOpen, { open: openConfirm, close: closeConfirm }] =
//     useDisclosure(false);
//   const [rejectOpen, { open: openReject, close: closeReject }] =
//     useDisclosure(false);
//   const [selected, setSelected] = useState<CashDrop | null>(null);

//   const query = useCashDrops({ page, limit: 20 });

//   const canDrop = auth.hasPermission('cash.drop');
//   const canVerify = auth.hasPermission('cash.drop.verify');

//   const columns: Column<CashDrop>[] = [
//     {
//       key: 'drop_ref',
//       header: 'Ref',
//       render: (r) => (
//         <Link
//           to="/cash-drops/$id"
//           params={{ id: r.id }}
//           style={{ textDecoration: 'none' }}
//         >
//           <Text c="blue" fw={500}>
//             {r.drop_ref}
//           </Text>
//         </Link>
//       ),
//     },
//     {
//       key: 'waiter',
//       header: 'Waiter',
//       render: (r) => r.waiter?.full_name || '-',
//     },
//     {
//       key: 'amount',
//       header: 'Amount',
//       align: 'right',
//       render: (r) => <Text fw={500}>{formatCurrency(r.total_amount)}</Text>,
//     },
//     {
//       key: 'dropped_at',
//       header: 'Dropped',
//       render: (r) => formatDateTime(r.dropped_at),
//     },
//     {
//       key: 'receiver',
//       header: 'Received By',
//       render: (r) =>
//         r.receiver?.full_name
//           ? `${r.receiver.full_name} (${r.receiver_role || ''})`
//           : '-',
//     },
//     {
//       key: 'status',
//       header: 'Status',
//       render: (r) => <StatBadge value={r.status} />,
//     },
//     {
//       key: 'actions',
//       header: '',
//       align: 'right',
//       render: (r) => {
//         if (r.status === 'pending' && canVerify && r.waiter_id !== auth.user?.id) {
//           return (
//             <Group gap="xs" justify="flex-end">
//               <Button
//                 size="compact-sm"
//                 color="green"
//                 leftSection={<Check size={14} />}
//                 onClick={() => {
//                   setSelected(r);
//                   openConfirm();
//                 }}
//               >
//                 Confirm
//               </Button>
//               <Button
//                 size="compact-sm"
//                 color="red"
//                 variant="light"
//                 leftSection={<X size={14} />}
//                 onClick={() => {
//                   setSelected(r);
//                   openReject();
//                 }}
//               >
//                 Reject
//               </Button>
//             </Group>
//           );
//         }
//         return null;
//       },
//     },
//   ];

//   return (
//     <>
//       <PageHeader
//         title="Cash Drops"
//         subtitle="Immediate cash handovers - waiters record, cashiers verify"
//         actions={
//           canDrop ? (
//             <Button leftSection={<Plus size={16} />} onClick={openCreate}>
//               Record Drop
//             </Button>
//           ) : undefined
//         }
//       />
//       <DataTable
//         data={query.data?.data ?? []}
//         columns={columns}
//         loading={query.isLoading}
//         error={query.error ? 'Failed to load cash drops' : null}
//         rowKey={(r) => r.id}
//         meta={query.data?.meta}
//         onPageChange={setPage}
//         emptyTitle="No cash drops"
//         emptyDescription="Cash drops are recorded by waiters after receiving cash."
//       />
//       <RecordCashDropModal opened={createOpen} onClose={closeCreate} />
//       <ConfirmCashDropModal
//         opened={confirmOpen}
//         onClose={closeConfirm}
//         drop={selected}
//       />
//       <RejectCashDropModal
//         opened={rejectOpen}
//         onClose={closeReject}
//         drop={selected}
//       />
//     </>
//   );
// }



























import { createFileRoute, Link } from '@tanstack/react-router';
import { Button, Group, Text, Stack, Card, Box, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Check, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { useCashDrops } from '@/hooks/usePayments';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatBadge } from '@/components/StatBadge';
import { RecordCashDropModal } from '@/components/payments/RecordCashDropModal';
import { ConfirmCashDropModal } from '@/components/payments/ConfirmCashDropModal';
import { RejectCashDropModal } from '@/components/payments/RejectCashDropModal';
import { CashDrop } from '@/lib/api/payments';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';

export const Route = createFileRoute('/_app/cash-drops/')({
  component: CashDropsPage,
});

function CashDropsPage() {
  const auth = useAuth();
  const [page, setPage] = useState(1);
  const [createOpen, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [confirmOpen, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);
  const [rejectOpen, { open: openReject, close: closeReject }] =
    useDisclosure(false);
  const [selected, setSelected] = useState<CashDrop | null>(null);

  const query = useCashDrops({ page, limit: 20 });

  const canDrop = auth.hasPermission('cash.drop');
  const canVerify = auth.hasPermission('cash.drop.verify');

  const columns: Column<CashDrop>[] = [
    {
      key: 'drop_ref',
      header: 'Ref',
      render: (r) => (
        <Link
          to="/cash-drops/$id"
          params={{ id: r.id }}
          style={{ textDecoration: 'none' }}
        >
          <Text c="blue" fw={500}>
            {r.drop_ref}
          </Text>
        </Link>
      ),
    },
    {
      key: 'waiter',
      header: 'Waiter',
      render: (r) => r.waiter?.full_name || '-',
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (r) => <Text fw={500}>{formatCurrency(r.total_amount)}</Text>,
    },
    {
      key: 'dropped_at',
      header: 'Dropped',
      render: (r) => formatDateTime(r.dropped_at),
    },
    {
      key: 'receiver',
      header: 'Received By',
      render: (r) =>
        r.receiver?.full_name
          ? `${r.receiver.full_name} (${r.receiver_role || ''})`
          : '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatBadge value={r.status} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (r) => {
        if (r.status === 'pending' && canVerify && r.waiter_id !== auth.user?.id) {
          return (
            <Group gap="xs" justify="flex-end">
              <Button
                size="compact-sm"
                color="green"
                leftSection={<Check size={14} />}
                onClick={() => {
                  setSelected(r);
                  openConfirm();
                }}
              >
                Confirm
              </Button>
              <Button
                size="compact-sm"
                color="red"
                variant="light"
                leftSection={<X size={14} />}
                onClick={() => {
                  setSelected(r);
                  openReject();
                }}
              >
                Reject
              </Button>
            </Group>
          );
        }
        return null;
      },
    },
  ];

  const renderMobileCard = (r: CashDrop) => (
    <Card key={r.id} withBorder padding="md" radius="md">
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Link
            to="/cash-drops/$id"
            params={{ id: r.id }}
            style={{ textDecoration: 'none' }}
          >
            <Text c="blue" fw={600} size="sm">
              {r.drop_ref}
            </Text>
          </Link>
          <StatBadge value={r.status} />
        </Group>

        <Group justify="space-between" wrap="nowrap">
          <Text size="xs" c="dimmed">
            Waiter
          </Text>
          <Text size="sm" fw={500} ta="right">
            {r.waiter?.full_name || '-'}
          </Text>
        </Group>

        <Group justify="space-between" wrap="nowrap">
          <Text size="xs" c="dimmed">
            Amount
          </Text>
          <Text size="sm" fw={600}>
            {formatCurrency(r.total_amount)}
          </Text>
        </Group>

        <Group justify="space-between" wrap="nowrap">
          <Text size="xs" c="dimmed">
            Dropped
          </Text>
          <Text size="sm" ta="right">
            {formatDateTime(r.dropped_at)}
          </Text>
        </Group>

        <Group justify="space-between" wrap="nowrap">
          <Text size="xs" c="dimmed">
            Received By
          </Text>
          <Text size="sm" ta="right">
            {r.receiver?.full_name
              ? `${r.receiver.full_name} (${r.receiver_role || ''})`
              : '-'}
          </Text>
        </Group>

        {r.status === 'pending' &&
          canVerify &&
          r.waiter_id !== auth.user?.id && (
            <Group grow mt="xs">
              <Button
                size="compact-sm"
                color="green"
                leftSection={<Check size={14} />}
                onClick={() => {
                  setSelected(r);
                  openConfirm();
                }}
              >
                Confirm
              </Button>
              <Button
                size="compact-sm"
                color="red"
                variant="light"
                leftSection={<X size={14} />}
                onClick={() => {
                  setSelected(r);
                  openReject();
                }}
              >
                Reject
              </Button>
            </Group>
          )}
      </Stack>
    </Card>
  );

  return (
    <>
      <PageHeader
        title="Cash Drops"
        subtitle="Immediate cash handovers - waiters record, cashiers verify"
        actions={
          canDrop ? (
            <Button leftSection={<Plus size={16} />} onClick={openCreate}>
              Record Drop
            </Button>
          ) : undefined
        }
      />

      {/* Mobile view */}
      <Box hiddenFrom="sm">
        {query.isLoading && (
          <Text c="dimmed" ta="center" py="xl">
            Loading...
          </Text>
        )}
        {query.error && (
          <Text c="red" ta="center" py="xl">
            Failed to load cash drops
          </Text>
        )}
        {!query.isLoading && !query.error && (
          <Stack gap="sm">
            {query.data?.data?.length ? (
              query.data.data.map(renderMobileCard)
            ) : (
              <Stack align="center" py="xl" gap="xs">
                <Text fw={500}>No cash drops</Text>
                <Text size="sm" c="dimmed" ta="center">
                  Cash drops are recorded by waiters after receiving cash.
                </Text>
              </Stack>
            )}
          </Stack>
        )}
      </Box>

      {/* Desktop view */}
      <Box visibleFrom="sm">
        <DataTable
          data={query.data?.data ?? []}
          columns={columns}
          loading={query.isLoading}
          error={query.error ? 'Failed to load cash drops' : null}
          rowKey={(r) => r.id}
          meta={query.data?.meta}
          onPageChange={setPage}
          emptyTitle="No cash drops"
          emptyDescription="Cash drops are recorded by waiters after receiving cash."
        />
      </Box>

      <RecordCashDropModal opened={createOpen} onClose={closeCreate} />
      <ConfirmCashDropModal
        opened={confirmOpen}
        onClose={closeConfirm}
        drop={selected}
      />
      <RejectCashDropModal
        opened={rejectOpen}
        onClose={closeReject}
        drop={selected}
      />
    </>
  );
}