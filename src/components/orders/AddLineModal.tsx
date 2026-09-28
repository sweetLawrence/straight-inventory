import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useAddOrderLine } from '@/hooks/useOrders';
import { useMenuItems } from '@/hooks/useCore';
import { getErrorMessage } from '@/lib/api/client';
import { formatCurrency } from '@/lib/utils/format';

interface Props {
  opened: boolean;
  onClose: () => void;
  orderId: string;
}

export function AddLineModal({ opened, onClose, orderId }: Props) {
  const menuItems = useMenuItems(1, 200);
  const addLine = useAddOrderLine(orderId);

  const form = useForm({
    initialValues: {
      menu_item_id: '',
      quantity: 1,
      notes: '',
    },
    validate: {
      menu_item_id: (v) => (v ? null : 'Required'),
      quantity: (v) => (v > 0 ? null : 'Must be > 0'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await addLine.mutateAsync({
        menu_item_id: values.menu_item_id,
        quantity: values.quantity,
        notes: values.notes || undefined,
      });
      notifications.show({
        color: 'green',
        title: 'Line added',
        message: 'Order has been updated.',
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

  const itemOptions =
    menuItems.data?.data
      .filter((m) => m.status === 'active')
      .map((m) => ({
        value: m.id,
        label: `${m.display_name}- ${formatCurrency(m.price)}`,
      })) || [];

  return (
    <Modal opened={opened} onClose={onClose} title="Add Item" size="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label="Menu Item"
            placeholder="Search item"
            searchable
            data={itemOptions}
            required
            {...form.getInputProps('menu_item_id')}
          />
          <NumberInput
            label="Quantity"
            min={1}
            required
            {...form.getInputProps('quantity')}
          />
          <Textarea
            label="Notes (optional)"
            autosize
            minRows={2}
            {...form.getInputProps('notes')}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={addLine.isPending}>
              Add
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}