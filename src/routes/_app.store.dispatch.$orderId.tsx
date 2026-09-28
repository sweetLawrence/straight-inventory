import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text
} from '@mantine/core'
import { ArrowLeft, Check, TriangleAlert } from 'lucide-react'
import { notifications } from '@mantine/notifications'
import { useDispatchPreview, useDispatchOrder } from '@/hooks/useStore'
import { PageHeader } from '@/components/PageHeader'
import { LoadingState } from '@/components/LoadingState'
import { EmptyState } from '@/components/EmptyState'
import { formatNumber } from '@/lib/utils/format'

export const Route = createFileRoute('/_app/store/dispatch/$orderId')({
  component: DispatchPage
})

function DispatchPage () {
  const { orderId } = Route.useParams()
  const navigate = useNavigate()
  const preview = useDispatchPreview(orderId)
  const dispatch = useDispatchOrder()

  if (preview.isLoading) return <LoadingState />
  if (preview.error || !preview.data) {
    return (
      <EmptyState
        title='Order not found'
        description='This order may have already been dispatched.'
      />
    )
  }

  const p = preview.data
  const allSufficient = p.components.every(c => c.sufficient !== false)

  const handleDispatch = async () => {
    try {
      const slip = await dispatch.mutateAsync(orderId)
      notifications.show({
        title: 'Dispatched',
        message: `Slip ${slip.slip_ref} created`,
        color: 'green'
      })
      navigate({
        to: '/slip/$id',
        params: { id: slip.id }
      })
    } catch (err: any) {
      notifications.show({
        title: 'Dispatch failed',
        message: err?.response?.data?.error || 'Something went wrong',
        color: 'red'
      })
    }
  }

  return (
    <>
      <Button
        variant='subtle'
        leftSection={<ArrowLeft size={16} />}
        component={Link}
        to='/store/queue'
        mb='sm'
      >
        Back to queue
      </Button>

      <PageHeader
        title={`Dispatch · Table ${p.order.table_number || '-'}`}
        subtitle={
          <>
            {p.order.order_ref} · {p.order.customer_code}
          </>
        }
        actions={
          <Button
            leftSection={<Check size={16} />}
            onClick={handleDispatch}
            loading={dispatch.isPending}
            disabled={!allSufficient}
          >
            Confirm dispatch
          </Button>
        }
      />

      {!allSufficient && (
        <Alert
          color='red'
          icon={<TriangleAlert size={16} />}
          title='Insufficient stock'
          mb='md'
        >
          One or more components don't have enough stock. Receive more stock
          before dispatching.
        </Alert>
      )}

      <Stack gap='md'>
        {p.components.map(c => {
          const insufficient = c.sufficient === false
          return (
            <Card
              key={c.stock_item_id}
              withBorder
              padding='md'
              radius='md'
              style={
                insufficient
                  ? { borderColor: 'var(--mantine-color-red-6)' }
                  : undefined
              }
            >
              <Group justify='space-between' align='flex-start'>
                <Stack gap={2}>
                  <Text fw={600}>{c.item.name}</Text>
                  <Text size='xs' c='dimmed'>
                    {c.item.code} · {c.stock_item.stock_model}
                  </Text>
                </Stack>
                <Stack gap={2} align='flex-end'>
                  <Text fw={600} size='lg'>
                    {formatNumber(c.total_qty, 3)}{' '}
                    <Text span size='sm' c='dimmed'>
                      {c.availability.unit || ''}
                    </Text>
                  </Text>
                  <Badge color={insufficient ? 'red' : 'green'} variant='light'>
                    {c.availability.available == null
                      ? 'unknown'
                      : `${formatNumber(
                          c.availability.available,
                          0
                        )} available`}
                  </Badge>
                </Stack>
              </Group>

              <Divider my='sm' />

              <Stack gap={4}>
                {c.breakdown.map((b, i) => (
                  <Group key={i} gap='md'>
                    <Text size='sm' fw={500} w={40} ta='right'>
                      {b.menu_qty}×
                    </Text>
                    <Text size='sm'>{b.menu_item_name}</Text>
                    <Text size='xs' c='dimmed'>
                      → {formatNumber(b.component_qty, 3)}{' '}
                      {c.availability.unit || ''}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          )
        })}
      </Stack>
    </>
  )
}
