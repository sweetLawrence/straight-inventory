import {
  Alert,
  Button,
  Card,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Info } from 'lucide-react';
import { useDispatchTransfer } from '@/hooks/useTransfers';
import { getErrorMessage } from '@/lib/api/client';
import { Transfer } from '@/lib/api/transfers';

interface Props {
  opened: boolean;
  onClose: () => void;
  transfer: Transfer | null;
}

export function DispatchTransferModal({ opened, onClose, transfer }: Props) {
  const dispatch = useDispatchTransfer();

  const form = useForm({
    initialValues: {
      lines: (transfer?.transfer_lines || []).map((l) => ({
        transfer_line_id: l.id,
        dispatched_qty: parseFloat(l.requested_qty),
        notes: '',
      })),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!transfer) return;
    try {
      await dispatch.mutateAsync({
        id: transfer.id,
        data: {
          lines: values.lines.map((l) => ({
            transfer_line_id: l.transfer_line_id,
            dispatched_qty: l.dispatched_qty,
            notes: l.notes || null,
          })),
        },
      });
      notifications.show({
        color: 'green',
        title: 'Dispatched',
        message: 'Stock is now in transit',
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

  if (!transfer) return null;

  return (
    <Modal opened={opened} onClose={onClose} title="Dispatch Transfer" size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Alert icon={<Info size={16} />} color="blue" variant="light">
            <Text size="sm">
              Record the actual quantities leaving your store. Source stock is
              deducted on dispatch.
            </Text>
          </Alert>

          {form.values.lines.map((line, idx) => {
            const tl = transfer.transfer_lines?.[idx];
            return (
              <Card key={line.transfer_line_id} withBorder padding="sm">
                <Stack gap="xs">
                  <Text size="sm" fw={500}>
                    {tl?.stock_item?.item?.name || 'Item'}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Requested: {tl?.requested_qty} {tl?.unit?.code}
                  </Text>
                  <NumberInput
                    label="Dispatched Quantity"
                    min={0}
                    decimalScale={3}
                    {...form.getInputProps(`lines.${idx}.dispatched_qty`)}
                  />
                  <Textarea
                    label="Notes (optional)"
                    autosize
                    minRows={1}
                    {...form.getInputProps(`lines.${idx}.notes`)}
                  />
                </Stack>
              </Card>
            );
          })}

          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={dispatch.isPending}>
              Dispatch
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}