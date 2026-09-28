import { createFileRoute, Link } from '@tanstack/react-router'
import { Button, Group, Text } from '@mantine/core'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { useOrders } from '@/hooks/useOrders'
import { useAuth } from '@/lib/auth/useAuth'
import { PageHeader } from '@/components/PageHeader'
import { DataTable, Column } from '@/components/DataTable'
import { apiClient, getErrorMessage } from '@/lib/api/client'
import { useQueryClient } from '@tanstack/react-query'
import { Order } from '@/lib/api/orders'
import { formatDateTime } from '@/lib/utils/format'

export const Route = createFileRoute('/_app/bar-approvals')({
  component: BarApprovalsPage
})

function BarApprovalsPage () {
  const [page, setPage] = useState(1)
  const qc = useQueryClient()
  const query = useOrders({
    page,
    limit: 20,
    approval_status: 'pending'
  })

  const handleApprove = async (id: string) => {
    try {
      await apiClient.post(`/orders/${id}/approve-bar`)
      notifications.show({
        color: 'green',
        title: 'Order approved',
        message: 'Bar items can now be issued.'
      })
      qc.invalidateQueries({ queryKey: ['orders'] })
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Failed',
        message: getErrorMessage(err)
      })
    }
  }

  const handleReject = async (id: string) => {
    const notes = window.prompt('Rejection reason:')
    if (notes === null) return
    try {
      await apiClient.post(`/orders/${id}/reject-bar`, { notes })
      notifications.show({
        color: 'orange',
        title: 'Order rejected',
        message: 'The bar order has been cancelled.'
      })
      qc.invalidateQueries({ queryKey: ['orders'] })
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Failed',
        message: getErrorMessage(err)
      })
    }
  }

  const columns: Column<Order>[] = [
    {
      key: 'order_ref',
      header: 'Order',
      render: r => (
        <Link
          to='/orders/$id'
          params={{ id: r.id }}
          style={{ textDecoration: 'none' }}
        >
          <Text c='blue' fw={500}>
            {r.order_ref}
          </Text>
        </Link>
      )
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
      key: 'created',
      header: 'Created',
      render: r => formatDateTime(r.created_at)
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: r => (
        <Group gap='xs' justify='flex-end'>
          <Button
            size='compact-sm'
            color='green'
            onClick={() => handleApprove(r.id)}
          >
            Approve
          </Button>
          <Button
            size='compact-sm'
            color='red'
            variant='light'
            onClick={() => handleReject(r.id)}
          >
            Reject
          </Button>
        </Group>
      )
    }
  ]

  return (
    <>
      <PageHeader
        title='Bar Approvals'
        subtitle='Pending bar orders awaiting MD approval'
      />
      <DataTable
        data={query.data?.data ?? []}
        columns={columns}
        loading={query.isLoading}
        error={query.error ? 'Failed to load approvals' : null}
        rowKey={r => r.id}
        meta={query.data?.meta}
        onPageChange={setPage}
        emptyTitle='No pending approvals'
        emptyDescription='New bar orders will appear here.'
      />
    </>
  )
}
