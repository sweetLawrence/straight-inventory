import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  UnstyledButton
} from '@mantine/core'
import {
  Banknote,
  CreditCard,
  Smartphone,
  Coins,
  User,
  Clock,
  ChevronRight,
  FileText
} from 'lucide-react'
import { useState } from 'react'
import { usePayments } from '@/hooks/usePayments'
import { PageHeader } from '@/components/PageHeader'
import { DataTable, Column } from '@/components/DataTable'
import { StatBadge } from '@/components/StatBadge'
import { Payment } from '@/lib/api/payments'
import { formatCurrency, formatDateTime } from '@/lib/utils/format'

export const Route = createFileRoute('/_app/payments/')({
  component: PaymentsPage
})

/* ------------------------------------------------------------------ */
/*  Method → icon + color                                              */
/* ------------------------------------------------------------------ */

const METHOD_META: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  cash: { icon: <Banknote size={11} />, color: 'green', label: 'Cash' },
  mpesa: { icon: <Smartphone size={11} />, color: 'teal', label: 'M-Pesa' },
  card: { icon: <CreditCard size={11} />, color: 'blue', label: 'Card' },
  other: { icon: <Coins size={11} />, color: 'gray', label: 'Other' }
}

function methodMeta (method: string) {
  return (
    METHOD_META[method.toLowerCase()] ?? {
      icon: <Coins size={11} />,
      color: 'gray',
      label: method
    }
  )
}

function paymentMethods (r: Payment): string[] {
  return r.payment_lines?.map(l => l.method) ?? []
}

/* ------------------------------------------------------------------ */

function PaymentsPage () {
  const [page, setPage] = useState(1)
  const query = usePayments({ page, limit: 20 })

  const columns: Column<Payment>[] = [
    {
      key: 'payment_ref',
      header: 'Reference',
      render: r => (
        <Stack gap={2}>
          <Text
            component={Link}
            to={`/payments/${r.id}`}
            size='sm'
            fw={600}
            c='brand.7'
            style={{ textDecoration: 'none' }}
          >
            {r.payment_ref}
          </Text>
          <Text size='xs' c='dimmed' ff='monospace'>
            #{r.id.slice(0, 8)}
          </Text>
        </Stack>
      )
    },
    {
      key: 'bill',
      header: 'Bill',
      render: r =>
        r.bill?.bill_ref ? (
          <Text size='sm'>{r.bill.bill_ref}</Text>
        ) : (
          <Text size='sm' c='dimmed'>
            -
          </Text>
        )
    },
    {
      key: 'waiter',
      header: 'Waiter',
      render: r =>
        r.waiter?.full_name ? (
          <Text size='sm'>{r.waiter.full_name}</Text>
        ) : (
          <Text size='sm' c='dimmed'>
            Unassigned
          </Text>
        )
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: r => (
        <Text size='sm' fw={600} style={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatCurrency(r.total_amount)}
        </Text>
      )
    },
    {
      key: 'methods',
      header: 'Methods',
      render: r => {
        const methods = paymentMethods(r)
        if (methods.length === 0) {
          return (
            <Text size='sm' c='dimmed'>
              -
            </Text>
          )
        }
        return (
          <Group gap={4} wrap='wrap'>
            {methods.map((m, i) => {
              const meta = methodMeta(m)
              return (
                <Badge
                  key={`${m}-${i}`}
                  variant='light'
                  color={meta.color}
                  size='sm'
                  radius='sm'
                  leftSection={meta.icon}
                >
                  {meta.label}
                </Badge>
              )
            })}
          </Group>
        )
      }
    },
    {
      key: 'status',
      header: 'Status',
      width: 130,
      render: r => <StatBadge value={r.status} />
    },
    {
      key: 'created',
      header: 'Created',
      render: r => {
        const [date, ...timeParts] = formatDateTime(r.created_at).split(' ')
        return (
          <Stack gap={0}>
            <Text size='sm'>{date}</Text>
            <Text size='xs' c='dimmed'>
              {timeParts.join(' ')}
            </Text>
          </Stack>
        )
      }
    }
  ]

  const payments = query.data?.data ?? []
  const meta = query.data?.meta

  return (
    <>
      <PageHeader title='Payments' subtitle='All payments recorded' />

      {/* Mobile + tablet: card list. Desktop: table. */}
      <Box hiddenFrom='md'>
        <MobilePaymentList
          payments={payments}
          loading={query.isLoading}
          error={query.error ? 'Failed to load payments' : null}
          meta={meta}
          onPageChange={setPage}
        />
      </Box>

      <Box visibleFrom='md'>
        <DataTable
          data={payments}
          columns={columns}
          loading={query.isLoading}
          error={query.error ? 'Failed to load payments' : null}
          rowKey={r => r.id}
          meta={meta}
          onPageChange={setPage}
          emptyTitle='No payments'
          emptyDescription='Payments are recorded from bills.'
        />
      </Box>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Mobile payment list                                               */
/* ------------------------------------------------------------------ */

type PaymentsMeta = NonNullable<ReturnType<typeof usePayments>['data']>['meta']

function MobilePaymentList ({
  payments,
  loading,
  error,
  meta,
  onPageChange
}: {
  payments: Payment[]
  loading: boolean
  error: string | null
  meta?: PaymentsMeta
  onPageChange: (p: number) => void
}) {
  if (loading) {
    return (
      <Stack gap='sm'>
        {[0, 1, 2, 3].map(i => (
          <Card key={i} withBorder radius='md' p='md'>
            <Group justify='space-between' mb='xs'>
              <Box
                style={{
                  width: 100,
                  height: 14,
                  background: 'var(--mantine-color-gray-2)',
                  borderRadius: 4
                }}
              />
              <Box
                style={{
                  width: 60,
                  height: 20,
                  background: 'var(--mantine-color-gray-2)',
                  borderRadius: 6
                }}
              />
            </Group>
            <Box
              style={{
                width: '55%',
                height: 12,
                background: 'var(--mantine-color-gray-1)',
                borderRadius: 4,
                marginBottom: 10
              }}
            />
            <Box
              style={{
                width: '35%',
                height: 12,
                background: 'var(--mantine-color-gray-1)',
                borderRadius: 4
              }}
            />
          </Card>
        ))}
      </Stack>
    )
  }

  if (error) {
    return (
      <Card withBorder radius='md' p='lg'>
        <Stack align='center' gap={4}>
          <Text fw={600} size='sm'>
            Couldn't load payments
          </Text>
          <Text size='xs' c='dimmed'>
            {error}
          </Text>
        </Stack>
      </Card>
    )
  }

  if (payments.length === 0) {
    return (
      <Card withBorder radius='md' p='xl'>
        <Stack align='center' gap={6}>
          <Text fw={600} size='sm'>
            No payments
          </Text>
          <Text size='xs' c='dimmed' ta='center'>
            Payments are recorded from bills.
          </Text>
        </Stack>
      </Card>
    )
  }

  const totalPages = meta?.pages ?? 1
  const currentPage = meta?.page ?? 1

  return (
    <>
      <Stack gap='sm'>
        {payments.map(payment => (
          <PaymentCard key={payment.id} payment={payment} />
        ))}
      </Stack>

      {totalPages > 1 && (
        <Group justify='space-between' mt='md' px={4}>
          <Button
            variant='default'
            size='sm'
            radius='md'
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <Text size='xs' c='dimmed'>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            variant='default'
            size='sm'
            radius='md'
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </Group>
      )}
    </>
  )
}

function PaymentCard ({ payment }: { payment: Payment }) {
  const [date, ...timeParts] = formatDateTime(payment.created_at).split(' ')
  const time = timeParts.join(' ')
  const methods = paymentMethods(payment)

  return (
    <UnstyledButton
      component={Link}
      to={`/payments/${payment.id}`}
      style={{ display: 'block' }}
    >
      <Card
        withBorder
        radius='md'
        p='md'
        style={{ transition: 'border-color 120ms ease' }}
      >
        {/* Row 1: ref + status */}
        <Group justify='space-between' align='center' mb='xs' wrap='nowrap'>
          <Group gap={8} wrap='nowrap' style={{ minWidth: 0 }}>
            <Text size='sm' fw={700} style={{ letterSpacing: '-0.01em' }}>
              {payment.payment_ref}
            </Text>
            <Text size='xs' c='dimmed' ff='monospace'>
              #{payment.id.slice(0, 6)}
            </Text>
          </Group>
          <StatBadge value={payment.status} />
        </Group>

        {/* Row 2: bill + waiter */}
        <Group gap='lg' mb='xs' wrap='wrap'>
          {payment.bill?.bill_ref && (
            <Group gap={6} wrap='nowrap'>
              <FileText size={13} color='var(--mantine-color-gray-6)' />
              <Text size='sm'>{payment.bill.bill_ref}</Text>
            </Group>
          )}
          <Group gap={6} wrap='nowrap'>
            <User size={13} color='var(--mantine-color-gray-6)' />
            <Text
              size='sm'
              c={payment.waiter?.full_name ? undefined : 'dimmed'}
              fs={payment.waiter?.full_name ? undefined : 'italic'}
            >
              {payment.waiter?.full_name || 'Unassigned'}
            </Text>
          </Group>
        </Group>

        {/* Row 3: methods */}
        {methods.length > 0 && (
          <Group gap={4} mb='xs' wrap='wrap'>
            {methods.map((m, i) => {
              const meta = methodMeta(m)
              return (
                <Badge
                  key={`${m}-${i}`}
                  variant='light'
                  color={meta.color}
                  size='xs'
                  radius='sm'
                  leftSection={meta.icon}
                >
                  {meta.label}
                </Badge>
              )
            })}
          </Group>
        )}

        <Divider my='xs' />

        {/* Row 4: time + amount */}
        <Group justify='space-between' align='center' wrap='nowrap'>
          <Group gap={6} wrap='nowrap'>
            <Clock size={12} color='var(--mantine-color-gray-6)' />
            <Text size='xs' c='dimmed'>
              {date} · {time}
            </Text>
          </Group>
          <Group gap={6} wrap='nowrap'>
            <Text
              size='sm'
              fw={700}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatCurrency(payment.total_amount)}
            </Text>
            <ChevronRight size={16} color='var(--mantine-color-gray-5)' />
          </Group>
        </Group>
      </Card>
    </UnstyledButton>
  )
}
