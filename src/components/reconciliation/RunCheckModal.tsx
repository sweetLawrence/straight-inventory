import { Alert, Button, Group, Modal, Select, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Info } from 'lucide-react';
import { useRunReconciliation } from '@/hooks/useAdmin';
import { getErrorMessage } from '@/lib/api/client';

interface Props {
  opened: boolean;
  onClose: () => void;
}

export function RunCheckModal({ opened, onClose }: Props) {
  const run = useRunReconciliation();

  const form = useForm({
    initialValues: {
      check_type: 'customer_bill' as
        | 'customer_bill'
        | 'waiter_collections'
        | 'stock_fulfilment',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const result = await run.mutateAsync(values);
      notifications.show({
        color: 'green',
        title: 'Reconciliation complete',
        message: `${result.count} checks created`,
      });
      onClose();
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Failed',
        message: getErrorMessage(err),
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Run Reconciliation Check">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Alert icon={<Info size={16} />} color="blue" variant="light">
            <Text size="sm">
              Runs the check against the current open business day and shift.
              Creates one reconciliation record per affected entity.
            </Text>
          </Alert>

          <Select
            label="Check Type"
            data={[
              {
                value: 'customer_bill',
                label: 'Customer Bill - net vs. payments',
              },
              {
                value: 'waiter_collections',
                label: 'Waiter Collections - recorded vs. verified',
              },
              {
                value: 'stock_fulfilment',
                label: 'Stock Fulfilment - ordered vs. issued',
              },
            ]}
            {...form.getInputProps('check_type')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={run.isPending}>
              Run Check
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}