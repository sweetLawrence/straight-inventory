import { createFileRoute, Link } from '@tanstack/react-router'
import { Text } from '@mantine/core'
import { useState } from 'react'
import { useBills } from '@/hooks/useOrders'
import { PageHeader } from '@/components/PageHeader'
import { DataTable, Column } from '@/components/DataTable'
import { StatBadge } from '@/components/StatBadge'
import { Bill } from '@/lib/api/orders'
import { formatCurrency, formatDateTime } from '@/lib/utils/format'

export const Route = createFileRoute('/_app/bills/')({
  component: BillsPage
})

function BillsPage () {
  const [page, setPage] = useState(1)
  const query = useBills({ page, limit: 20 })

  const columns: Column<Bill>[] = [
   {
  key: 'bill_ref',
  header: 'Ref',
  render: (r) => (
    <Link to="/bills/$id" params={{ id: r.id }} style={{ textDecoration: 'none' }}>
      <Text c="blue" fw={500}>
        {r.bill_ref}
      </Text>
    </Link>
  ),
},
    {
      key: 'customer',
      header: 'Customer',
      render: r => <Text size='sm'>{r.customer_code}</Text>
    },
    {
      key: 'waiter',
      header: 'Waiter',
      render: r => r.waiter?.full_name || '-'
    },
    {
      key: 'gross',
      header: 'Gross',
      align: 'right',
      render: r => formatCurrency(r.gross_total)
    },
    {
      key: 'discount',
      header: 'Discount',
      align: 'right',
      render: r => {
        const d = parseFloat(r.discount_total)
        return d > 0 ? (
          <Text c='red' size='sm'>
            -{formatCurrency(d)}
          </Text>
        ) : (
          <Text c='dimmed' size='sm'>
            -
          </Text>
        )
      }
    },
    {
      key: 'net',
      header: 'Net',
      align: 'right',
      render: r => <Text fw={600}>{formatCurrency(r.net_total)}</Text>
    },
    {
      key: 'status',
      header: 'Status',
      render: r => <StatBadge value={r.status} />
    },
    {
      key: 'created',
      header: 'Created',
      render: r => formatDateTime(r.created_at)
    }
  ]

  return (
    <>
      <PageHeader title='Bills' subtitle='All bills in your scope' />
      <DataTable
        data={query.data?.data ?? []}
        columns={columns}
        loading={query.isLoading}
        error={query.error ? 'Failed to load bills' : null}
        rowKey={r => r.id}
        meta={query.data?.meta}
        onPageChange={setPage}
        emptyTitle='No bills'
        emptyDescription='Bills are created from orders.'
      />
    </>
  )
}
