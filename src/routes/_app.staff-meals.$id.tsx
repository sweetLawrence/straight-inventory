import { createFileRoute, Link } from '@tanstack/react-router';
import { Button, Card, Grid, Table, Text, Title } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import { useStaffMeal } from '@/hooks/useOperations';
import { PageHeader } from '@/components/PageHeader';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { StatBadge } from '@/components/StatBadge';
import { formatCurrency, formatDateTime, formatNumber } from '@/lib/utils/format';

export const Route = createFileRoute('/_app/staff-meals/$id')({
  component: StaffMealDetailPage,
});

function StaffMealDetailPage() {
  const { id } = Route.useParams();
  const query = useStaffMeal(id);

  if (query.isLoading) return <LoadingState />;
  if (query.error || !query.data)
    return <EmptyState title="Staff meal not found" />;

  const m = query.data;

  return (
    <>
      <Link to="/staff-meals" style={{ textDecoration: 'none' }}>
        <Button variant="subtle" leftSection={<ArrowLeft size={16} />} mb="sm">
          Back to staff meals
        </Button>
      </Link>

      <PageHeader
        title={m.staff_meal_ref}
        subtitle={`${m.staff_name} - ${m.meal_type}`}
        actions={<StatBadge value={m.status} />}
      />

      <Grid mb="lg">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">Total Cost</Text>
            <Text fw={600} size="lg">{formatCurrency(m.total_cost)}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">Authorized By</Text>
            <Text fw={500}>{m.authorized_by_user?.full_name || '-'}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">When</Text>
            <Text fw={500}>{formatDateTime(m.authorized_at)}</Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Card withBorder>
        <Title order={4} mb="sm">Items</Title>
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Item</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Qty</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Cost</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {m.staff_meal_lines?.map((l) => (
              <Table.Tr key={l.id}>
                <Table.Td>{l.stock_item?.item?.name || '-'}</Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  {formatNumber(l.quantity, 3)} {l.unit?.code}
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  {formatCurrency(l.cost_amount)}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </>
  );
}