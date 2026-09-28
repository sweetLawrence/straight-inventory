// import { createFileRoute, Link } from '@tanstack/react-router';
// import {
//   Button,
//   Card,
//   Grid,
//   Group,
//   Stack,
//   Table,
//   Text,
//   Title,
// } from '@mantine/core';
// import { ArrowLeft } from 'lucide-react';
// import { usePayment } from '@/hooks/usePayments';
// import { PageHeader } from '@/components/PageHeader';
// import { LoadingState } from '@/components/LoadingState';
// import { EmptyState } from '@/components/EmptyState';
// import { StatBadge } from '@/components/StatBadge';
// import { formatCurrency, formatDateTime } from '@/lib/utils/format';

// export const Route = createFileRoute('/_app/payments/$id')({
//   component: PaymentDetailPage,
// });

// function PaymentDetailPage() {
//   const { id } = Route.useParams();
//   const query = usePayment(id);

//   if (query.isLoading) return <LoadingState />;
//   if (query.error || !query.data)
//     return <EmptyState title="Payment not found" />;

//   const p = query.data;

//   return (
//     <>
//       <Button
//         variant="subtle"
//         leftSection={<ArrowLeft size={16} />}
//         component={Link}
//         to="/payments"
//         mb="sm"
//       >
//         Back to payments
//       </Button>

//       <PageHeader
//         title={p.payment_ref}
//         subtitle={`Bill: ${p.bill?.bill_ref || '-'} • Waiter: ${p.waiter?.full_name || '-'}`}
//         actions={<StatBadge value={p.status} />}
//       />

//       <Grid mb="lg">
//         <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
//           <Card withBorder>
//             <Text size="sm" c="dimmed">
//               Total
//             </Text>
//             <Text fw={600} size="lg">
//               {formatCurrency(p.total_amount)}
//             </Text>
//           </Card>
//         </Grid.Col>
//         <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
//           <Card withBorder>
//             <Text size="sm" c="dimmed">
//               Methods
//             </Text>
//             <Text fw={500}>
//               {p.payment_lines?.map((l) => l.method).join(', ') || '-'}
//             </Text>
//           </Card>
//         </Grid.Col>
//         <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
//           <Card withBorder>
//             <Text size="sm" c="dimmed">
//               Created
//             </Text>
//             <Text fw={500}>{formatDateTime(p.created_at)}</Text>
//           </Card>
//         </Grid.Col>
//       </Grid>

//       <Card withBorder>
//         <Title order={4} mb="sm">
//           Payment Lines
//         </Title>
//         <Table striped>
//           <Table.Thead>
//             <Table.Tr>
//               <Table.Th>Method</Table.Th>
//               <Table.Th>Reference</Table.Th>
//               <Table.Th>Status</Table.Th>
//               <Table.Th>Verified By</Table.Th>
//               <Table.Th style={{ textAlign: 'right' }}>Amount</Table.Th>
//             </Table.Tr>
//           </Table.Thead>
//           <Table.Tbody>
//             {p.payment_lines?.map((l) => (
//               <Table.Tr key={l.id}>
//                 <Table.Td>
//                   <StatBadge value={l.method} />
//                 </Table.Td>
//                 <Table.Td>
//                   <Text size="sm" c="dimmed">
//                     {l.transaction_ref || '-'}
//                   </Text>
//                 </Table.Td>
//                 <Table.Td>
//                   <StatBadge value={l.verification_status} />
//                 </Table.Td>
//                 <Table.Td>
//                   <Text size="sm">{l.verified_by_user?.full_name || '-'}</Text>
//                 </Table.Td>
//                 <Table.Td style={{ textAlign: 'right' }}>
//                   <Text fw={500}>{formatCurrency(l.amount)}</Text>
//                 </Table.Td>
//               </Table.Tr>
//             ))}
//           </Table.Tbody>
//         </Table>
//       </Card>
//     </>
//   );
// }

import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core'
import {
  ArrowLeft,
  Banknote,
  CreditCard,
  Smartphone,
  Coins,
  Receipt,
  User,
  Calendar,
  Hash,
  Clock,
  ShieldCheck
} from 'lucide-react'
import type { ReactNode } from 'react'
import { usePayment } from '@/hooks/usePayments'
import { PageHeader } from '@/components/PageHeader'
import { LoadingState } from '@/components/LoadingState'
import { EmptyState } from '@/components/EmptyState'
import { StatBadge } from '@/components/StatBadge'
import { formatCurrency, formatDateTime } from '@/lib/utils/format'

export const Route = createFileRoute('/_app/payments/$id')({
  component: PaymentDetailPage
})

/* ------------------------------------------------------------------ */
/*  Method metadata                                                    */
/* ------------------------------------------------------------------ */

const METHOD_META: Record<
  string,
  { icon: ReactNode; color: string; label: string }
> = {
  cash: { icon: <Banknote size={12} />, color: 'green', label: 'Cash' },
  mpesa: { icon: <Smartphone size={12} />, color: 'teal', label: 'M-Pesa' },
  card: { icon: <CreditCard size={12} />, color: 'blue', label: 'Card' },
  other: { icon: <Coins size={12} />, color: 'gray', label: 'Other' }
}

function methodMeta (method: string) {
  return (
    METHOD_META[method.toLowerCase()] ?? {
      icon: <Coins size={12} />,
      color: 'gray',
      label: method
    }
  )
}

/* ------------------------------------------------------------------ */

function PaymentDetailPage () {
  const { id } = Route.useParams()
  const query = usePayment(id)

  if (query.isLoading) return <LoadingState />
  if (query.error || !query.data)
    return <EmptyState title='Payment not found' />

  const p = query.data
  const lines = p.payment_lines ?? []
  const lineCount = lines.length

  return (
    <Box>
      {/* ---------- Back link ---------- */}
      <Button
        variant='subtle'
        color='gray'
        leftSection={<ArrowLeft size={16} />}
        component={Link}
        to='/payments'
        mb='sm'
        size='sm'
        radius='md'
        px={6}
      >
        Back to payments
      </Button>

      {/* ---------- Header ---------- */}
      <PageHeader
        title={p.payment_ref}
        subtitle={
          <Group gap='lg' wrap='wrap'>
            {p.bill?.bill_ref && (
              <Group gap={6} wrap='nowrap'>
                <Receipt size={13} color='var(--mantine-color-gray-6)' />
                <Text size='sm' c='dimmed'>
                  {p.bill.bill_ref}
                </Text>
              </Group>
            )}
            <Group gap={6} wrap='nowrap'>
              <User size={13} color='var(--mantine-color-gray-6)' />
              <Text size='sm' c='dimmed'>
                {p.waiter?.full_name || 'Unassigned'}
              </Text>
            </Group>
            <Group gap={6} wrap='nowrap'>
              <Calendar size={13} color='var(--mantine-color-gray-6)' />
              <Text size='sm' c='dimmed'>
                {formatDateTime(p.created_at)}
              </Text>
            </Group>
          </Group>
        }
        actions={
          <Group gap='sm'>
            <StatBadge value={p.status} />
          </Group>
        }
      />

      {/* ---------- KPI cards ---------- */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} mb='lg' spacing='md'>
        <KpiCard
          icon={<Receipt size={16} />}
          label='Total'
          value={formatCurrency(p.total_amount)}
          sub={
            lineCount === 0
              ? 'No lines'
              : `${lineCount} line${lineCount === 1 ? '' : 's'}`
          }
        />
        <KpiCard
          icon={<Banknote size={16} />}
          label='Methods'
          value={
            lineCount === 0
              ? '-'
              : Array.from(new Set(lines.map(l => l.method)))
                  .map(m => methodMeta(m).label)
                  .join(' · ')
          }
          sub='How this payment was settled'
        />
        <KpiCard
          icon={<Clock size={16} />}
          label='Created'
          value={formatDateTime(p.created_at).split(' ')[0]}
          sub={formatDateTime(p.created_at).split(' ').slice(1).join(' ')}
        />
      </SimpleGrid>

      {/* ---------- Payment Lines ---------- */}
      <Card withBorder radius='md' p={0} style={{ overflow: 'hidden' }}>
        <Group justify='space-between' align='center' p='md' pb='sm'>
          <Box>
            <Title order={5} fw={600}>
              Payment Lines
            </Title>
            <Text size='xs' c='dimmed' mt={2}>
              {lineCount === 0
                ? 'No lines recorded'
                : `${lineCount} line${lineCount === 1 ? '' : 's'}`}
            </Text>
          </Box>
        </Group>

        <Divider />

        {lineCount === 0 ? (
          <Stack align='center' py='xl' gap={6}>
            <ThemeIcon variant='light' color='gray' size='lg' radius='md'>
              <Receipt size={18} />
            </ThemeIcon>
            <Text size='sm' fw={600}>
              No payment lines
            </Text>
            <Text size='xs' c='dimmed' ta='center' maw={280}>
              This payment has no recorded lines.
            </Text>
          </Stack>
        ) : (
          <>
            {/* Mobile + tablet: stacked line cards */}
            <Box hiddenFrom='md' p='md' pt='sm'>
              <Stack gap='xs'>
                {lines.map(line => (
                  <PaymentLineCard key={line.id} line={line} />
                ))}
              </Stack>
            </Box>

            {/* Desktop: table */}
            <Box visibleFrom='md'>
              <PaymentLinesTable lines={lines} />
            </Box>
          </>
        )}

        {lineCount > 0 && (
          <>
            <Divider />
            <Group justify='space-between' align='center' p='md'>
              <Text size='sm' c='dimmed'>
                Total
              </Text>
              <Text
                fw={700}
                size='lg'
                style={{
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.02em'
                }}
              >
                {formatCurrency(p.total_amount)}
              </Text>
            </Group>
          </>
        )}
      </Card>
    </Box>
  )
}

/* ------------------------------------------------------------------ */
/*  KPI card                                                          */
/* ------------------------------------------------------------------ */

function KpiCard ({
  icon,
  label,
  value,
  sub
}: {
  icon: ReactNode
  label: string
  value: string
  sub?: string
}) {
  return (
    <Card withBorder radius='md' p='md'>
      <Group justify='space-between' align='flex-start' mb='xs' wrap='nowrap'>
        <Text
          size='xs'
          fw={600}
          c='dimmed'
          tt='uppercase'
          style={{ letterSpacing: 0.5 }}
        >
          {label}
        </Text>
        <ThemeIcon variant='light' color='gray' size='md' radius='md'>
          {icon}
        </ThemeIcon>
      </Group>

      <Text
        fw={700}
        size='lg'
        style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}
        lineClamp={1}
      >
        {value}
      </Text>

      {sub && (
        <Text size='xs' c='dimmed' mt={6}>
          {sub}
        </Text>
      )}
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Payment line card (mobile)                                        */
/* ------------------------------------------------------------------ */

type PaymentLine = NonNullable<
  NonNullable<ReturnType<typeof usePayment>['data']>['payment_lines']
>[number]

function PaymentLineCard ({ line }: { line: PaymentLine }) {
  const meta = methodMeta(line.method)

  return (
    <Card withBorder radius='md' p='sm'>
      <Group justify='space-between' align='flex-start' wrap='nowrap' mb={6}>
        <Box style={{ minWidth: 0, flex: 1 }}>
          <Badge
            variant='light'
            color={meta.color}
            size='sm'
            radius='sm'
            leftSection={meta.icon}
          >
            {meta.label}
          </Badge>
          {line.transaction_ref && (
            <Group gap={6} mt={6} wrap='nowrap'>
              <Hash size={12} color='var(--mantine-color-gray-6)' />
              <Text size='xs' c='dimmed' ff='monospace' lineClamp={1}>
                {line.transaction_ref}
              </Text>
            </Group>
          )}
        </Box>
        <Text
          fw={700}
          size='sm'
          style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}
        >
          {formatCurrency(line.amount)}
        </Text>
      </Group>

      <Divider my='xs' />

      <Group justify='space-between' align='center' wrap='wrap' gap='xs'>
        <Group gap={6} wrap='nowrap'>
          <StatBadge value={line.verification_status} />
        </Group>
        <Group gap={6} wrap='nowrap'>
          <ShieldCheck size={12} color='var(--mantine-color-gray-6)' />
          <Text size='xs' c='dimmed'>
            {line.verified_by_user?.full_name || 'Pending verification'}
          </Text>
        </Group>
      </Group>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Payment lines table (desktop)                                     */
/* ------------------------------------------------------------------ */

function PaymentLinesTable ({ lines }: { lines: PaymentLine[] }) {
  return (
    <Table highlightOnHover verticalSpacing='sm' horizontalSpacing='md'>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Method</Table.Th>
          <Table.Th>Reference</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Verified By</Table.Th>
          <Table.Th style={{ textAlign: 'right' }}>Amount</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {lines.map(line => {
          const meta = methodMeta(line.method)
          return (
            <Table.Tr key={line.id}>
              <Table.Td>
                <Badge
                  variant='light'
                  color={meta.color}
                  size='sm'
                  radius='sm'
                  leftSection={meta.icon}
                >
                  {meta.label}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text size='sm' c='dimmed' ff='monospace'>
                  {line.transaction_ref || '-'}
                </Text>
              </Table.Td>
              <Table.Td>
                <StatBadge value={line.verification_status} />
              </Table.Td>
              <Table.Td>
                <Text
                  size='sm'
                  c={line.verified_by_user?.full_name ? undefined : 'dimmed'}
                >
                  {line.verified_by_user?.full_name || '-'}
                </Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text
                  size='sm'
                  fw={600}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {formatCurrency(line.amount)}
                </Text>
              </Table.Td>
            </Table.Tr>
          )
        })}
      </Table.Tbody>
    </Table>
  )
}
