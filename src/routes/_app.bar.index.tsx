import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  Grid,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title
} from '@mantine/core'
import { Package, Receipt, Banknote } from 'lucide-react'
import { useStockItems, useLedgerSummary } from '@/hooks/useStock'
import { useOrders } from '@/hooks/useOrders'
import { useCurrentHandover } from '@/hooks/usePayments'
import { PageHeader } from '@/components/PageHeader'
import { formatCurrency } from '@/lib/utils/format'

export const Route = createFileRoute('/_app/bar/')({
  component: BarDashboard
})

function BarDashboard () {
  const stock = useStockItems({ limit: 200, store_type: 'bar_store' })
  const orders = useOrders({ page: 1, limit: 1, status: 'open' })
  const handover = useCurrentHandover()

  return (
    <>
      <PageHeader title='Bar Dashboard' subtitle='Your bar at a glance' />

      <SimpleGrid cols={{ base: 1, sm: 3 }} mb='lg'>
        <Card withBorder padding='md'>
          <Stack gap='xs'>
            <Text size='xs' c='dimmed' fw={500}>
              Bar Stock Items
            </Text>
            <Text size='xl' fw={700}>
              {stock.data?.meta.total ?? 0}
            </Text>
          </Stack>
        </Card>
        <Card withBorder padding='md'>
          <Stack gap='xs'>
            <Text size='xs' c='dimmed' fw={500}>
              Open Bar Orders
            </Text>
            <Text size='xl' fw={700}>
              {orders.data?.meta.total ?? 0}
            </Text>
          </Stack>
        </Card>
        <Card withBorder padding='md'>
          <Stack gap='xs'>
            <Text size='xs' c='dimmed' fw={500}>
              Cash Pending
            </Text>
            <Text size='xl' fw={700}>
              {handover.data ? formatCurrency(handover.data.cash_pending) : '-'}
            </Text>
          </Stack>
        </Card>
      </SimpleGrid>

      <Card withBorder>
        <Text fw={600} mb='sm'>
          Quick Links
        </Text>
        <Stack gap='xs'>
          <Link to='/bar/stock' style={{ textDecoration: 'none' }}>
            <Text c='blue'>→ View bar stock</Text>
          </Link>
          <Link to='/orders' style={{ textDecoration: 'none' }}>
            <Text c='blue'>→ Manage bar orders (auto-filtered)</Text>
          </Link>
          <Link to='/handover' style={{ textDecoration: 'none' }}>
            <Text c='blue'>→ Submit handover (auto-filtered)</Text>
          </Link>
        </Stack>
      </Card>
    </>
  )
}
