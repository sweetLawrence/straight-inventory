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
import { useStockItems, useCreateBulkIssue } from '@/hooks/useStock';
import { useUnits } from '@/hooks/useCore';
import { getErrorMessage } from '@/lib/api/client';

interface Props {
  opened: boolean;
  onClose: () => void;
}

export function CreateBulkIssueModal({ opened, onClose }: Props) {
  const stockItems = useStockItems({ limit: 200, stock_model: 'bulk' });
  const units = useUnits();
  const create = useCreateBulkIssue();

  const form = useForm({
    initialValues: {
      stock_item_id: '',
      quantity: 0,
      unit_id: '',
      purpose: '',
    },
    validate: {
      stock_item_id: (v) => (v ? null : 'Required'),
      quantity: (v) => (v > 0 ? null : 'Must be > 0'),
      unit_id: (v) => (v ? null : 'Required'),
      purpose: (v) => (v.trim() ? null : 'Required'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await create.mutateAsync(values);
      notifications.show({
        color: 'green',
        title: 'Bulk issue recorded',
        message: 'Stock has been issued to the kitchen.',
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
    stockItems.data?.data.map((s) => ({
      value: s.id,
      label: s.item?.name || s.item?.code || 'Item',
    })) || [];

  const unitOptions =
    units.data?.data.map((u) => ({ value: u.id, label: u.name })) || [];

  return (
    <Modal opened={opened} onClose={onClose} title="New Bulk Issue" size="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label="Bulk Item"
            placeholder="Select bulk stock item"
            searchable
            data={itemOptions}
            required
            {...form.getInputProps('stock_item_id')}
          />
          <Group grow>
            <NumberInput
              label="Quantity"
              placeholder="e.g. 2"
              min={0}
              decimalScale={3}
              required
              {...form.getInputProps('quantity')}
            />
            <Select
              label="Unit"
              placeholder="Unit"
              data={unitOptions}
              required
              {...form.getInputProps('unit_id')}
            />
          </Group>
          <TextInput
            label="Purpose"
            placeholder="e.g. Kitchen daily issue"
            required
            {...form.getInputProps('purpose')}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={create.isPending}>
              Issue
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}