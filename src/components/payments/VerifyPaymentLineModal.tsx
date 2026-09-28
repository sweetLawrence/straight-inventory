import {
  Alert,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Info } from 'lucide-react';
import { useVerifyPaymentLine } from '@/hooks/usePayments';
import { getErrorMessage } from '@/lib/api/client';
import { formatCurrency } from '@/lib/utils/format';
import { PendingPaymentLine } from '@/lib/api/payments';

interface Props {
  opened: boolean;
  onClose: () => void;
  line: PendingPaymentLine | null;
}

export function VerifyPaymentLineModal({ opened, onClose, line }: Props) {
  const verify = useVerifyPaymentLine();

  const form = useForm({
    initialValues: {
      verification_status: 'verified' as 'verified' | 'unverified' | 'failed',
      verification_notes: '',
    },
    validate: {
      verification_status: (v) => (v ? null : 'Required'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!line) return;
    try {
      await verify.mutateAsync({
        lineId: line.id,
        data: {
          verification_status: values.verification_status,
          verification_notes: values.verification_notes || undefined,
        },
      });
      notifications.show({
        color: 'green',
        title: 'Payment line verified',
        message: `Line marked as ${values.verification_status}.`,
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

  if (!line) return null;

  return (
    <Modal opened={opened} onClose={onClose} title="Verify Payment Line">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Alert icon={<Info size={16} />} color="blue" variant="light">
            <Stack gap={2}>
              <Text size="sm">
                Method: <strong>{line.method}</strong>
              </Text>
              <Text size="sm">
                Amount: <strong>{formatCurrency(line.amount)}</strong>
              </Text>
              <Text size="sm">
                Ref: <strong>{line.transaction_ref || '-'}</strong>
              </Text>
              <Text size="sm">
                Bill: <strong>{line.payment?.bill?.bill_ref || '-'}</strong>
              </Text>
              <Text size="sm">
                Waiter: <strong>{line.payment?.waiter?.full_name || '-'}</strong>
              </Text>
            </Stack>
          </Alert>

          <Select
            label="Verification Result"
            data={[
              { value: 'verified', label: 'Verified- matched' },
              { value: 'unverified', label: 'Unverified- not found' },
              { value: 'failed', label: 'Failed- invalid' },
            ]}
            required
            {...form.getInputProps('verification_status')}
          />

          <Textarea
            label="Notes (optional)"
            placeholder="Any remarks"
            autosize
            minRows={2}
            {...form.getInputProps('verification_notes')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={verify.isPending}>
              Submit
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}