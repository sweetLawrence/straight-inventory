import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useCreateFloat } from '@/hooks/usePayments';
import { useUsers } from '@/hooks/useCore';
import { getErrorMessage } from '@/lib/api/client';

interface Props {
  opened: boolean;
  onClose: () => void;
}

export function FloatEntryModal({ opened, onClose }: Props) {
  const users = useUsers(1, 200);
  const create = useCreateFloat();

  const form = useForm({
    initialValues: {
      waiter_id: '',
      event_type: 'issued' as 'issued' | 'returned' | 'top_up',
      amount: 0,
      notes: '',
    },
    validate: {
      waiter_id: (v) => (v ? null : 'Required'),
      event_type: (v) => (v ? null : 'Required'),
      amount: (v) => (v > 0 ? null : 'Must be > 0'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await create.mutateAsync({
        waiter_id: values.waiter_id,
        event_type: values.event_type,
        amount: values.amount,
        notes: values.notes || undefined,
      });
      notifications.show({
        color: 'green',
        title: 'Float recorded',
        message: `${values.event_type}- ${values.amount}`,
      });
      form.reset();
      onClose();
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Failed',
        message: getErrorMessage(err),
      });
    }
  };

  const waiterOptions =
    users.data?.data.map((u) => ({
      value: u.id,
      label: `${u.full_name} (${u.username})`,
    })) || [];

  return (
    <Modal opened={opened} onClose={onClose} title="Float Entry">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label="Waiter"
            placeholder="Select waiter"
            searchable
            data={waiterOptions}
            required
            {...form.getInputProps('waiter_id')}
          />
          <Select
            label="Event"
            data={[
              { value: 'issued', label: 'Issued' },
              { value: 'returned', label: 'Returned' },
              { value: 'top_up', label: 'Top Up' },
            ]}
            required
            {...form.getInputProps('event_type')}
          />
          <NumberInput
            label="Amount (KES)"
            min={0}
            decimalScale={2}
            required
            {...form.getInputProps('amount')}
          />
          <TextInput
            label="Notes (optional)"
            {...form.getInputProps('notes')}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={create.isPending}>
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
