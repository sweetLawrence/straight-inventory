import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { useStoreQueue } from '@/hooks/useStore'
import { PageHeader } from '@/components/PageHeader'
import { LoadingState } from '@/components/LoadingState'
import { EmptyState } from '@/components/EmptyState'
import { formatDateTime } from '@/lib/utils/format'

export const Route = createFileRoute('/_app/store/queue')({
  component: StoreQueuePage
})

function StoreQueuePage () {
  const navigate = useNavigate()
  const query = useStoreQueue({ limit: 50 })

  if (query.isLoading) return <LoadingState />

  const orders = query.data?.data ?? []

  return (
    <>
      <PageHeader
        title='Store Queue'
        subtitle='Pending kitchen orders waiting to be dispatched'
        actions={
          <Button
            variant='light'
            leftSection={<RefreshCw size={16} />}
            onClick={() => query.refetch()}
            loading={query.isFetching}
          >
            Refresh
          </Button>
        }
      />

      {orders.length === 0 ? (
        <EmptyState
          title='Nothing to dispatch'
          description='New orders will appear here as waiters place them.'
        />
      ) : (
        <Stack gap='md'>
          {orders.map(o => (
            <Card key={o.order_id} withBorder padding='md' radius='md'>
              <Group justify='space-between' align='flex-start' mb='sm'>
                <Stack gap={2}>
                  <Group gap='xs'>
                    <Text fw={600}>Table {o.table_number || '-'}</Text>
                    <Badge variant='light'>{o.order_ref}</Badge>
                    <Badge variant='light' color='gray'>
                      {o.customer_code}
                    </Badge>
                  </Group>
                  <Text size='xs' c='dimmed'>
                    {o.waiter?.full_name || 'Unknown waiter'} ·{' '}
                    {formatDateTime(o.created_at)}
                  </Text>
                </Stack>
                <Button
                  rightSection={<ArrowRight size={16} />}
                  onClick={() =>
                    navigate({
                      to: '/store/dispatch/$orderId',
                      params: { orderId: o.order_id }
                    })
                  }
                >
                  Review & dispatch
                </Button>
              </Group>

              <Stack gap={4} mt='xs'>
                {o.lines.map(l => (
                  <Group key={l.order_line_id} gap='md'>
                    <Text size='sm' fw={500} w={40} ta='right'>
                      {l.quantity}×
                    </Text>
                    <Text size='sm'>{l.menu_item_name || '-'}</Text>
                    {l.notes && (
                      <Text size='xs' c='dimmed'>
                        · {l.notes}
                      </Text>
                    )}
                  </Group>
                ))}
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </>
  )
}
