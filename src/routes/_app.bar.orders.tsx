// import { createFileRoute, Link } from '@tanstack/react-router';
// import { Text } from '@mantine/core';
// import { useState } from 'react';
// import { useOrders } from '@/hooks/useOrders';
// import { PageHeader } from '@/components/PageHeader';
// import { DataTable, Column } from '@/components/DataTable';
// import { StatBadge } from '@/components/StatBadge';
// import { Order } from '@/lib/api/orders';
// import { formatDateTime } from '@/lib/utils/format';

// export const Route = createFileRoute('/_app/bar/orders')({
//   component: BarOrdersPage,
// });

// function BarOrdersPage() {
//   const [page, setPage] = useState(1);
//   const query = useOrders({ page, limit: 20 });

//   const columns: Column<Order>[] = [
//     {
//       key: 'order_ref',
//       header: 'Ref',
//       render: (r) => (
//         <Link
//           to="/orders/$id"
//           params={{ id: r.id }}
//           style={{ textDecoration: 'none' }}
//         >
//           <Text c="blue" fw={500}>
//             {r.order_ref}
//           </Text>
//         </Link>
//       ),
//     },
//     {
//       key: 'customer_code',
//       header: 'Customer',
//       render: (r) => <Text size="sm">{r.customer_code}</Text>,
//     },
//     {
//       key: 'table',
//       header: 'Table',
//       render: (r) => r.table_number || '-',
//       width: 80,
//     },
//     {
//       key: 'waiter',
//       header: 'Waiter',
//       render: (r) => r.waiter?.full_name || '-',
//     },
//     {
//       key: 'outlet',
//       header: 'Outlet',
//       render: (r) => <StatBadge value={r.outlet || 'restaurant'} />,
//     },
//     {
//       key: 'status',
//       header: 'Status',
//       render: (r) => <StatBadge value={r.status} />,
//     },
//     {
//       key: 'created',
//       header: 'Created',
//       render: (r) => formatDateTime(r.created_at),
//     },
//   ];

//   return (
//     <>
//       <PageHeader
//         title="Bar Orders"
//         subtitle="Orders containing bar items"
//       />
//       <DataTable
//         data={query.data?.data ?? []}
//         columns={columns}
//         loading={query.isLoading}
//         error={query.error ? 'Failed to load orders' : null}
//         rowKey={(r) => r.id}
//         meta={query.data?.meta}
//         onPageChange={setPage}
//         emptyTitle="No bar orders"
//         emptyDescription="Bar orders will appear here."
//       />
//     </>
//   );
// }

import { createFileRoute } from '@tanstack/react-router'
import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Clock, Hash, User, Wine } from 'lucide-react'
import { useState } from 'react'
import { useBarPending, useIssueBarLine } from '@/hooks/useOrders'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { getErrorMessage } from '@/lib/api/client'
import { formatCurrency, formatDateTime } from '@/lib/utils/format'

export const Route = createFileRoute('/_app/bar/orders')({
  component: BarOrdersPage
})

function BarOrdersPage () {
  const [page] = useState(1)
  const query = useBarPending(page, 50)
  const issue = useIssueBarLine()

  const handleIssue = async (orderLineId: string, itemName: string) => {
    try {
      await issue.mutateAsync(orderLineId)
      notifications.show({
        color: 'green',
        title: 'Issued',
        message: `${itemName} issued from stock.`
      })
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Failed',
        message: getErrorMessage(err)
      })
    }
  }

  const lines = query.data?.data ?? []

  return (
    <>
      <PageHeader title='Bar Orders' subtitle='Pending drinks awaiting issue' />

      {query.isLoading ? (
        <Center py='xl'>
          <Loader />
        </Center>
      ) : lines.length === 0 ? (
        <EmptyState
          title='No pending bar items'
          description='New drink orders from the waiters will appear here.'
        />
      ) : (
        <Stack gap='sm'>
          {lines.map(line => (
            <Card key={line.order_line_id} withBorder radius='md' p='md'>
              <Group justify='space-between' wrap='nowrap' align='flex-start'>
                <Group gap='sm' wrap='nowrap' style={{ minWidth: 0 }}>
                  <ThemeIcon
                    size='lg'
                    radius='md'
                    variant='light'
                    color='grape'
                  >
                    <Wine size={18} />
                  </ThemeIcon>
                  <Box style={{ minWidth: 0 }}>
                    <Text fw={600} size='sm'>
                      {line.menu_item_name} × {line.quantity}
                    </Text>
                    <Group gap='md' mt={4} wrap='wrap'>
                      <Text size='xs' c='dimmed'>
                        {line.order_ref}
                      </Text>
                      {line.table_number && (
                        <Group gap={4} wrap='nowrap'>
                          <Hash size={11} color='var(--mantine-color-gray-6)' />
                          <Text size='xs' c='dimmed'>
                            Table {line.table_number}
                          </Text>
                        </Group>
                      )}
                      {line.waiter_name && (
                        <Group gap={4} wrap='nowrap'>
                          <User size={11} color='var(--mantine-color-gray-6)' />
                          <Text size='xs' c='dimmed'>
                            {line.waiter_name}
                          </Text>
                        </Group>
                      )}
                      <Group gap={4} wrap='nowrap'>
                        <Clock size={11} color='var(--mantine-color-gray-6)' />
                        <Text size='xs' c='dimmed'>
                          {formatDateTime(line.created_at)}
                        </Text>
                      </Group>
                    </Group>
                  </Box>
                </Group>

                <Group gap='sm' wrap='nowrap'>
                  <Badge variant='light' color='grape' size='lg'>
                    {formatCurrency(
                      parseFloat(line.unit_price) * line.quantity
                    )}
                  </Badge>
                  <Button
                    size='sm'
                    radius='md'
                    onClick={() =>
                      handleIssue(line.order_line_id, line.menu_item_name)
                    }
                    loading={
                      issue.isPending && issue.variables === line.order_line_id
                    }
                  >
                    Issue
                  </Button>
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      )}
    </>
  )
}
