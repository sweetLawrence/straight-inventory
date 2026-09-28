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
import { useCreateWaste } from '@/hooks/useOperations';
import { useStockItems } from '@/hooks/useStock';
import { useUnits } from '@/hooks/useCore';
import { getErrorMessage } from '@/lib/api/client';

interface Props {
  opened: boolean;
  onClose: () => void;
}

export function CreateWasteModal({ opened, onClose }: Props) {
  const stockItems = useStockItems({ limit: 200 });
  const units = useUnits();
  const create = useCreateWaste();

  const form = useForm({
    initialValues: {
      stock_item_id: '',
      quantity: 0,
      unit_id: '',
      cost_amount: 0,
      reason: '',
    },
    validate: {
      stock_item_id: (v) => (v ? null : 'Required'),
      quantity: (v) => (v > 0 ? null : 'Must be > 0'),
      unit_id: (v) => (v ? null : 'Required'),
      reason: (v) => (v.trim() ? null : 'Required'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const w = await create.mutateAsync(values);
      notifications.show({
        color: 'green',
        title: 'Waste recorded',
        message: `${w.waste_ref} - stock written off`,
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

  const stockItemOptions =
    stockItems.data?.data.map((s) => ({
      value: s.id,
      label: `${s.item?.name || 'Item'} (${s.stock_model})`,
    })) || [];

  const unitOptions =
    units.data?.data.map((u) => ({ value: u.id, label: u.name })) || [];

  return (
    <Modal opened={opened} onClose={onClose} title="Record Waste" size="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label="Stock Item"
            searchable
            data={stockItemOptions}
            required
            {...form.getInputProps('stock_item_id')}
          />
          <Group grow>
            <NumberInput
              label="Quantity"
              min={0}
              decimalScale={3}
              required
              {...form.getInputProps('quantity')}
            />
            <Select
              label="Unit"
              data={unitOptions}
              required
              {...form.getInputProps('unit_id')}
            />
          </Group>
          <NumberInput
            label="Cost Impact (KES)"
            min={0}
            decimalScale={2}
            required
            {...form.getInputProps('cost_amount')}
          />
          <TextInput
            label="Reason"
            placeholder="e.g. Spoilage, Burnt, Broken"
            required
            {...form.getInputProps('reason')}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="red" loading={create.isPending}>
              Record Waste
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}