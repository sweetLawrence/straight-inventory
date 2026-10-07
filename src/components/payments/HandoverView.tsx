import { Alert, Button, Card, Group, Loader, SegmentedControl, SimpleGrid, Stack, Table, Text, Title } from '@mantine/core';
import { useState } from 'react';
import dayjs from 'dayjs';
import { Info, RotateCw } from 'lucide-react';
import { useCurrentHandover } from '@/hooks/usePayments';
import { useAuth } from '@/lib/auth/useAuth';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { getErrorMessage } from '@/lib/api/client';
import { formatCurrency } from '@/lib/utils/format';

const METHODS = [
  { key: 'cash', label: 'Cash' },
  { key: 'mpesa', label: 'M-Pesa' },
  { key: 'card', label: 'Card' },
  { key: 'other', label: 'Other' },
] as const;

const C = { navy: '#1F3A5F', orange: '#E8590C', red: '#E03131', muted: '#868E96' };

/**
 * One handover screen for waiters (their own bills) and the bar (the whole bar's
 * takings this shift). Same cards, same columns, same wording on both.
 */
export function HandoverView({ title }: { title: string }) {
  const auth = useAuth();
  // A handover belongs to one waiter (or the bar) at one property and shift
  const groupLevel = auth.hasRole('md', 'admin');
  const [which, setWhich] = useState<'current' | 'previous'>('current');
  const query = useCurrentHandover(!groupLevel, which);
  // Switch between the live shift and the one before it (e.g. last night after the 06:00 roll-over)
  const shiftPicker = (
    <SegmentedControl
      size="xs"
      value={which}
      onChange={(v) => setWhich(v as 'current' | 'previous')}
      data={[
        { value: 'current', label: 'This shift' },
        { value: 'previous', label: 'Previous shift' },
      ]}
    />
  );
  if (groupLevel) {
    return (
      <>
        <PageHeader title={title} subtitle="Per waiter and shift" />
        <EmptyState
          title="Handovers are per waiter"
          description="Each waiter and the bar see their own handover for the current shift. For every waiter across both properties, open Reports → Sales and collections by waiter."
        />
      </>
    );
  }

  if (query.isLoading) {
    return (
      <Stack align="center" py="xl">
        <Loader />
      </Stack>
    );
  }

  if (query.error || !query.data) {
    return (
      <Stack align="center" py="xl" gap="sm">
        {shiftPicker}
        <EmptyState title="Handover unavailable" description={getErrorMessage(query.error)} />
        <Button variant="light" leftSection={<RotateCw size={14} />} onClick={() => query.refetch()}>
          Try again
        </Button>
      </Stack>
    );
  }

  const h = query.data;
  const isBar = h.scope === 'outlet';
  const live = which === 'current';
  const shiftText = h.shift
    ? live
      ? `${h.shift.name} · since ${dayjs(h.shift.opened_at).format('ddd D MMM, HH:mm')}`
      : `${h.shift.name} · ${dayjs(h.shift.opened_at).format('ddd D MMM, HH:mm')}–${h.shift.closed_at ? dayjs(h.shift.closed_at).format('HH:mm') : 'now'}`
    : 'Current shift';
  const nothingYet =
    h.total_bills_count === 0 &&
    Object.values(h.totals_by_method || {}).every((v) => !Number(v)) &&
    !h.drops_count &&
    !Number(h.float_issued) &&
    !Number(h.float_returned);

  return (
    <>
      <PageHeader
        title={title}
        subtitle={`${shiftText} · ${isBar ? "the whole bar's takings" : 'your bills, payments and cash'}`}
        actions={
          <Group gap="xs">
            {shiftPicker}
            <Text size="xs" c="dimmed">
              As of {dayjs(h.as_of || undefined).format('HH:mm')}
            </Text>
            <Button
              size="xs"
              variant="default"
              leftSection={<RotateCw size={14} />}
              loading={query.isFetching}
              onClick={() => query.refetch()}
            >
              Refresh
            </Button>
          </Group>
        }
      />

      {nothingYet && (
        <Alert color="blue" variant="light" icon={<Info size={16} />} mb="lg">
          {live
            ? `Nothing recorded yet in this shift (${h.shift?.name || 'current shift'} started ${dayjs(h.shift?.opened_at).format('HH:mm')}). Figures appear as soon as you bill, take payment or drop cash. Earlier work is under Previous shift.`
            : 'Nothing was recorded in the previous shift.'}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 2, lg: 4 }} mb="lg">
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Bills
          </Text>
          <Text fw={700} size="lg" style={{ color: C.navy }}>
            {h.total_bills_count}
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            {formatCurrency(h.total_bills)} total
          </Text>
        </Card>
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Cash dropped
          </Text>
          <Text fw={700} size="lg" style={{ color: C.navy }}>
            {formatCurrency(h.cash_dropped)}
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            {h.drops_count} drop{h.drops_count === 1 ? '' : 's'}
          </Text>
        </Card>
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Cash still to drop
          </Text>
          <Text fw={700} size="lg" style={{ color: h.cash_pending > 0 ? C.orange : C.muted }}>
            {formatCurrency(h.cash_pending)}
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            Cash taken minus cash dropped
          </Text>
        </Card>
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Float net
          </Text>
          <Text fw={700} size="lg" style={{ color: C.navy }}>
            {formatCurrency(h.float_net)}
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            Issued {formatCurrency(h.float_issued)} · Returned {formatCurrency(h.float_returned)}
          </Text>
        </Card>
      </SimpleGrid>

      <Card withBorder mb="lg">
        <Title order={4} mb="sm">
          By method
        </Title>
        <Table.ScrollContainer minWidth={560}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Method</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Amount</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Waiting</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Verified</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Not matched</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Failed</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {METHODS.map(({ key, label }) => {
                const st = h.status_by_method[key] || { pending: 0, verified: 0, unverified: 0, failed: 0 };
                const cell = (n: number, color?: string) => (
                  <Table.Td style={{ textAlign: 'right', color: n ? color : C.muted }}>{n || 0}</Table.Td>
                );
                return (
                  <Table.Tr key={key}>
                    <Table.Td>
                      <Text fw={500}>{label}</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(h.totals_by_method[key])}</Table.Td>
                    {cell(st.pending, C.orange)}
                    {cell(st.verified)}
                    {cell(st.unverified, C.orange)}
                    {cell(st.failed, C.red)}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        <Text size="xs" c="dimmed" mt="xs">
          Counts are payment lines. Waiting = not yet checked by the cashier (cash is checked when the cash drop is
          confirmed). Not matched = checked but the amount or reference did not match. Failed = money not received.
        </Text>
      </Card>

      <Alert icon={<Info size={16} />} color="blue" variant="light">
        <Text size="sm">
          These figures are for {isBar ? 'all bar sales' : 'your bills'} in this shift and update as the cashier
          checks payments and confirms drops. A new shift starts from zero.
        </Text>
      </Alert>
    </>
  );
}