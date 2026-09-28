import { createFileRoute } from '@tanstack/react-router';
import {
  Alert,
  Card,
  Loader,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { Info } from 'lucide-react';
import { useCurrentHandover } from '@/hooks/usePayments';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency } from '@/lib/utils/format';

export const Route = createFileRoute('/_app/bar/handover')({
  component: BarHandoverPage,
});

function BarHandoverPage() {
  const query = useCurrentHandover();

  if (query.isLoading) {
    return (
      <Stack align="center" py="xl">
        <Loader />
      </Stack>
    );
  }

  if (query.error || !query.data) {
    return (
      <EmptyState
        title="Handover unavailable"
        description="No open shift, or you are not assigned to one."
      />
    );
  }

  const h = query.data;

  return (
    <>
      <PageHeader
        title="Bar Handover"
        subtitle="Current shift bar summary"
      />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="lg">
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Bills
          </Text>
          <Text fw={600} size="lg">
            {h.total_bills_count}
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            {formatCurrency(h.total_bills)} total
          </Text>
        </Card>
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Cash Dropped
          </Text>
          <Text fw={600} size="lg">
            {formatCurrency(h.cash_dropped)}
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            {h.drops_count} drops
          </Text>
        </Card>
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Cash Pending
          </Text>
          <Text
            fw={600}
            size="lg"
            c={h.cash_pending > 0 ? 'orange' : 'green'}
          >
            {formatCurrency(h.cash_pending)}
          </Text>
        </Card>
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Float Net
          </Text>
          <Text fw={600} size="lg">
            {formatCurrency(h.float_net)}
          </Text>
        </Card>
      </SimpleGrid>

      <Card withBorder mb="lg">
        <Title order={4} mb="sm">
          By Method
        </Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Method</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Total</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Pending</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Verified</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Unverified</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {(['cash', 'mpesa', 'card', 'other'] as const).map((m) => (
              <Table.Tr key={m}>
                <Table.Td>
                  <Text fw={500} tt="capitalize">
                    {m}
                  </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  {formatCurrency(h.totals_by_method[m])}
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  {h.status_by_method[m]?.pending || 0}
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  {h.status_by_method[m]?.verified || 0}
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  {h.status_by_method[m]?.unverified || 0}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Alert icon={<Info size={16} />} color="blue" variant="light">
        <Text size="sm">
          Unverified ≠ zero. Submitted ≠ approved.
        </Text>
      </Alert>
    </>
  );
}