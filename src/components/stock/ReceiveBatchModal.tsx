import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useStockItems, useCreateBatch } from '@/hooks/useStock';
import { useUnits } from '@/hooks/useCore';
import { getErrorMessage } from '@/lib/api/client';

interface Props {
  opened: boolean;
  onClose: () => void;
}

export function ReceiveBatchModal({ opened, onClose }: Props) {
  const stockItems = useStockItems({ limit: 200 });
  const units = useUnits();
  const createBatch = useCreateBatch();

  const form = useForm({
    initialValues: {
      stock_item_id: '',
      received_qty: 0,
      received_unit_id: '',
      total_cost: 0,
      purchase_ref: '',
      expiry_date: null as Date | null,
    },
    validate: {
      stock_item_id: (v) => (v ? null : 'Required'),
      received_qty: (v) => (v > 0 ? null : 'Must be > 0'),
      received_unit_id: (v) => (v ? null : 'Required'),
      total_cost: (v) => (v >= 0 ? null : 'Must be ≥ 0'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await createBatch.mutateAsync({
        stock_item_id: values.stock_item_id,
        received_qty: values.received_qty,
        received_unit_id: values.received_unit_id,
        total_cost: values.total_cost,
        purchase_ref: values.purchase_ref || undefined,
        expiry_date: values.expiry_date
          ? values.expiry_date.toISOString().slice(0, 10)
          : undefined,
      });
      notifications.show({
        color: 'green',
        title: 'Batch received',
        message: 'Stock has been added to the ledger.',
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
      label: `${s.item?.name || s.item?.code || 'Item'} (${s.stock_model})`,
    })) || [];

  const unitOptions =
    units.data?.data.map((u) => ({ value: u.id, label: u.name })) || [];

  return (
    <Modal opened={opened} onClose={onClose} title="Receive Batch" size="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label="Stock Item"
            placeholder="Select item"
            searchable
            data={stockItemOptions}
            required
            {...form.getInputProps('stock_item_id')}
          />
          <Group grow>
            <NumberInput
              label="Quantity"
              placeholder="e.g. 100"
              min={0}
              decimalScale={3}
              required
              {...form.getInputProps('received_qty')}
            />
            <Select
              label="Unit"
              placeholder="Unit"
              data={unitOptions}
              required
              {...form.getInputProps('received_unit_id')}
            />
          </Group>
          <NumberInput
            label="Total Cost (KES)"
            placeholder="e.g. 5000"
            min={0}
            decimalScale={2}
            required
            {...form.getInputProps('total_cost')}
          />
          <TextInput
            label="Purchase Ref"
            placeholder="e.g. INV-2026-001"
            {...form.getInputProps('purchase_ref')}
          />
          <DateInput
            label="Expiry Date (optional)"
            placeholder="Pick date"
            valueFormat="YYYY-MM-DD"
            clearable
            {...form.getInputProps('expiry_date')}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={createBatch.isPending}>
              Receive
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}