import { createFileRoute, Link } from '@tanstack/react-router'
import { Box, Button, Card, Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { ChevronRight, Clock, Hash, User } from 'lucide-react'
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
      render: r => (
        <Link to='/bills/$id' params={{ id: r.id }} style={{ textDecoration: 'none' }}>
          <Text c='blue' fw={500}>
            {r.bill_ref}
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

  const bills = query.data?.data ?? []
  const meta = query.data?.meta

  return (
    <>
      <PageHeader title='Bills' subtitle='All bills in your scope' />

      {/* Mobile + tablet: card list. Desktop: table. */}
      <Box hiddenFrom='md'>
        <MobileBillList
          bills={bills}
          loading={query.isLoading}
          error={query.error ? 'Failed to load bills' : null}
          page={meta?.page ?? 1}
          pages={meta?.pages ?? 1}
          onPageChange={setPage}
        />
      </Box>

      <Box visibleFrom='md'>
        <DataTable
          data={bills}
          columns={columns}
          loading={query.isLoading}
          error={query.error ? 'Failed to load bills' : null}
          rowKey={r => r.id}
          meta={meta}
          onPageChange={setPage}
          emptyTitle='No bills'
          emptyDescription='Bills are created from orders.'
        />
      </Box>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Mobile bill list - tap-friendly cards                             */
/* ------------------------------------------------------------------ */

function MobileBillList ({
  bills,
  loading,
  error,
  page,
  pages,
  onPageChange
}: {
  bills: Bill[]
  loading: boolean
  error: string | null
  page: number
  pages: number
  onPageChange: (p: number) => void
}) {
  if (loading) {
    return (
      <Stack gap='sm'>
        {[0, 1, 2, 3].map(i => (
          <Card key={i} withBorder radius='md' p='md'>
            <Box style={{ width: 110, height: 14, background: '#E9ECEF', borderRadius: 4, marginBottom: 10 }} />
            <Box style={{ width: '55%', height: 12, background: '#F1F3F5', borderRadius: 4 }} />
          </Card>
        ))}
      </Stack>
    )
  }

  if (error) {
    return (
      <Card withBorder radius='md' p='lg'>
        <Stack align='center' gap={4}>
          <Text fw={600} size='sm'>Couldn't load bills</Text>
          <Text size='xs' c='dimmed'>{error}</Text>
        </Stack>
      </Card>
    )
  }

  if (bills.length === 0) {
    return (
      <Card withBorder radius='md' p='xl'>
        <Stack align='center' gap={6}>
          <Text fw={600} size='sm'>No bills</Text>
          <Text size='xs' c='dimmed' ta='center'>Bills are created from orders.</Text>
        </Stack>
      </Card>
    )
  }

  return (
    <>
      <Stack gap='sm'>
        {bills.map(bill => (
          <BillCard key={bill.id} bill={bill} />
        ))}
      </Stack>

      {pages > 1 && (
        <Group justify='space-between' mt='md' px={4}>
          <Button variant='default' size='sm' radius='md' disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </Button>
          <Text size='xs' c='dimmed'>Page {page} of {pages}</Text>
          <Button variant='default' size='sm' radius='md' disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
            Next
          </Button>
        </Group>
      )}
    </>
  )
}

function BillCard ({ bill }: { bill: Bill }) {
  const discount = parseFloat(bill.discount_total)

  return (
    <UnstyledButton component={Link} to={`/bills/${bill.id}`} style={{ display: 'block' }}>
      <Card withBorder radius='md' p='md'>
        {/* Row 1: ref + status */}
        <Group justify='space-between' align='center' mb={6} wrap='nowrap'>
          <Text size='sm' fw={700} truncate style={{ letterSpacing: '-0.01em' }}>
            {bill.bill_ref}
          </Text>
          <StatBadge value={bill.status} />
        </Group>

        {/* Row 2: customer + waiter */}
        <Group gap='md' mb={10} wrap='wrap'>
          <Group gap={4} wrap='nowrap'>
            <Hash size={13} color='#868E96' />
            <Text size='xs' c='dimmed'>{bill.customer_code}</Text>
          </Group>
          {bill.waiter?.full_name && (
            <Group gap={4} wrap='nowrap'>
              <User size={13} color='#868E96' />
              <Text size='xs' c='dimmed'>{bill.waiter.full_name}</Text>
            </Group>
          )}
          <Group gap={4} wrap='nowrap'>
            <Clock size={13} color='#868E96' />
            <Text size='xs' c='dimmed'>{formatDateTime(bill.created_at)}</Text>
          </Group>
        </Group>

        {/* Row 3: totals */}
        <Group justify='space-between' align='flex-end' wrap='nowrap'>
          <Stack gap={0}>
            {discount > 0 && (
              <Text size='xs' c='dimmed'>
                {formatCurrency(bill.gross_total)} · <Text span size='xs' c='red'>-{formatCurrency(discount)}</Text>
              </Text>
            )}
            <Text fw={700} size='lg'>{formatCurrency(bill.net_total)}</Text>
          </Stack>
          <ChevronRight size={18} color='#ADB5BD' />
        </Group>
      </Card>
    </UnstyledButton>
  )
}
