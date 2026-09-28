// import { createFileRoute, Link } from '@tanstack/react-router';
// import {
//   Button,
//   Card,
//   Grid,
//   Group,
//   Stack,
//   Table,
//   Text,
//   Box,
//   Divider,
//   ThemeIcon,
//   Badge,
// } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
// import { ArrowLeft, Banknote, Percent, Receipt, CreditCard } from 'lucide-react';
// import { useBill } from '@/hooks/useOrders';
// import { useAuth } from '@/lib/auth/useAuth';
// import { PageHeader } from '@/components/PageHeader';
// import { LoadingState } from '@/components/LoadingState';
// import { EmptyState } from '@/components/EmptyState';
// import { StatBadge } from '@/components/StatBadge';
// import { ApplyDiscountModal } from '@/components/orders/ApplyDiscountModal';
// import { RecordPaymentModal } from '@/components/payments/RecordPaymentModal';
// import { formatCurrency, formatDateTime } from '@/lib/utils/format';

// import { Printer } from 'lucide-react';

// export const Route = createFileRoute('/_app/bills/$id')({
//   component: BillDetailPage,
// });

// /* -------------------------------------------------------------- */
// /*  Summary cell - small, quiet label + strong mono number        */
// /* -------------------------------------------------------------- */
// function SummaryCell({
//   label,
//   value,
//   accent,
//   emphasis,
// }: {
//   label: string;
//   value: string;
//   accent?: 'red' | 'blue' | 'gray';
//   emphasis?: boolean;
// }) {
//   const color =
//     accent === 'red'
//       ? 'red.7'
//       : accent === 'blue'
//       ? 'blue.7'
//       : emphasis
//       ? 'gray.9'
//       : undefined;

//   return (
//     <Box
//       p="md"
//       style={{
//         borderRight: '1px solid var(--mantine-color-gray-2)',
//         height: '100%',
//       }}
//     >
//       <Text
//         size="xs"
//         c="dimmed"
//         fw={600}
//         tt="uppercase"
//         style={{ letterSpacing: 0.6 }}
//         mb={6}
//       >
//         {label}
//       </Text>
//       <Text
//         fw={emphasis ? 700 : 600}
//         size={emphasis ? 'xl' : 'lg'}
//         c={color}
//         ff="monospace"
//         style={{ letterSpacing: '-0.02em' }}
//       >
//         {value}
//       </Text>
//     </Box>
//   );
// }

// /* -------------------------------------------------------------- */
// /*  Section card - consistent header style for every block        */
// /* -------------------------------------------------------------- */
// function SectionCard({
//   icon,
//   title,
//   right,
//   children,
//   noPadding,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   right?: React.ReactNode;
//   children: React.ReactNode;
//   noPadding?: boolean;
// }) {
//   return (
//     <Card
//       withBorder
//       radius="md"
//       p={0}
//       mb="lg"
//       style={{ overflow: 'hidden' }}
//     >
//       <Group
//         justify="space-between"
//         px="lg"
//         py="md"
//         style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
//       >
//         <Group gap="sm">
//           <ThemeIcon size={28} radius="md" variant="light" color="blue">
//             {icon}
//           </ThemeIcon>
//           <Text fw={600} size="sm">
//             {title}
//           </Text>
//         </Group>
//         {right}
//       </Group>
//       <Box p={noPadding ? 0 : 'lg'}>{children}</Box>
//     </Card>
//   );
// }

// function BillDetailPage() {
//   const { id } = Route.useParams();
//   const auth = useAuth();
//   const bill = useBill(id);
//   const [discountOpen, { open: openDiscount, close: closeDiscount }] =
//     useDisclosure(false);
//   const [paymentOpen, { open: openPayment, close: closePayment }] =
//     useDisclosure(false);

//   if (bill.isLoading) return <LoadingState />;
//   if (bill.error || !bill.data) return <EmptyState title="Bill not found" />;

//   const b = bill.data;
//   const canDiscount =
//     b.status === 'open' && auth.hasPermission('bill.discount');
//   const canPay = b.status === 'open' && auth.hasPermission('payment.record');

//   const hasDiscount = parseFloat(b.discount_total) > 0;

//   return (
//     <>
//       {/* Back link */}
//       <Button
//         component={Link}
//         to="/bills"
//         variant="subtle"
//         color="gray"
//         size="sm"
//         leftSection={<ArrowLeft size={15} />}
//         mb="md"
//         px="xs"
//       >
//         Back to bills
//       </Button>

//       <PageHeader
//         title={b.bill_ref}
//         subtitle={`Customer: ${b.customer_code} • Waiter: ${b.waiter?.full_name || '-'}`}
//         actions={
//           <Group gap="sm">
//             <StatBadge value={b.status} />
//             {canDiscount && (
//               <Button
//                 leftSection={<Percent size={15} />}
//                 variant="light"
//                 radius="md"
//                 onClick={openDiscount}
//               >
//                 Apply Discount
//               </Button>
//             )}
//             {canPay && (
//               <Button
//                 leftSection={<Banknote size={15} />}
//                 radius="md"
//                 onClick={openPayment}
//               >
//                 Record Payment
//               </Button>
//             )}
//           </Group>
//         }
//       />

//       {/* ---------------- Summary strip ---------------- */}
//       <Card
//         withBorder
//         radius="md"
//         p={0}
//         mb="lg"
//         style={{ overflow: 'hidden' }}
//       >
//         <Grid>
//           <Grid.Col span={{ base: 12, sm: 4 }}>
//             <SummaryCell label="Gross" value={formatCurrency(b.gross_total)} />
//           </Grid.Col>
//           <Grid.Col span={{ base: 12, sm: 4 }}>
//             <SummaryCell
//               label="Discount"
//               value={
//                 hasDiscount
//                   ? `-${formatCurrency(b.discount_total)}`
//                   : formatCurrency(0)
//               }
//               accent={hasDiscount ? 'red' : 'gray'}
//             />
//           </Grid.Col>
//           <Grid.Col span={{ base: 12, sm: 4 }}>
//             <Box
//               p="md"
//               style={{ background: 'var(--mantine-color-blue-0)' }}
//             >
//               <Text
//                 size="xs"
//                 c="blue.8"
//                 fw={600}
//                 tt="uppercase"
//                 style={{ letterSpacing: 0.6 }}
//                 mb={6}
//               >
//                 Net Total
//               </Text>
//               <Text
//                 fw={700}
//                 size="xl"
//                 c="blue.9"
//                 ff="monospace"
//                 style={{ letterSpacing: '-0.02em' }}
//               >
//                 {formatCurrency(b.net_total)}
//               </Text>
//             </Box>
//           </Grid.Col>
//         </Grid>
//       </Card>

//       {/* ---------------- Bill lines ---------------- */}
//       <SectionCard
//         icon={<Receipt size={15} />}
//         title="Bill Lines"
//         right={
//           <Badge variant="light" color="gray" radius="sm" size="md">
//             {b.bill_lines?.length ?? 0} item
//             {(b.bill_lines?.length ?? 0) === 1 ? '' : 's'}
//           </Badge>
//         }
//         noPadding
//       >
//         <Table
//           horizontalSpacing="lg"
//           verticalSpacing="sm"
//           highlightOnHover
//           highlightOnHoverColor="var(--mantine-color-gray-0)"
//           styles={{
//             th: {
//               background: 'var(--mantine-color-gray-0)',
//               color: 'var(--mantine-color-gray-6)',
//               fontWeight: 600,
//               fontSize: 11,
//               letterSpacing: 0.6,
//               textTransform: 'uppercase',
//               borderBottom: '1px solid var(--mantine-color-gray-2)',
//             },
//             td: {
//               borderBottom: '1px solid var(--mantine-color-gray-1)',
//               fontSize: 13.5,
//             },
//             tr: {
//               '&:last-of-type td': { borderBottom: 'none' },
//             },
//           }}
//         >
//           <Table.Thead>
//             <Table.Tr>
//               <Table.Th>Description</Table.Th>
//               <Table.Th style={{ textAlign: 'right', width: 80 }}>Qty</Table.Th>
//               <Table.Th style={{ textAlign: 'right', width: 140 }}>
//                 Unit Price
//               </Table.Th>
//               <Table.Th style={{ textAlign: 'right', width: 140 }}>Total</Table.Th>
//             </Table.Tr>
//           </Table.Thead>
//           <Table.Tbody>
//             {b.bill_lines?.map((line) => (
//               <Table.Tr key={line.id}>
//                 <Table.Td>
//                   <Text size="sm" fw={500}>
//                     {line.description}
//                   </Text>
//                 </Table.Td>
//                 <Table.Td style={{ textAlign: 'right' }}>
//                   <Text size="sm" c="dimmed" ff="monospace">
//                     {line.quantity}
//                   </Text>
//                 </Table.Td>
//                 <Table.Td style={{ textAlign: 'right' }}>
//                   <Text size="sm" c="dimmed" ff="monospace">
//                     {formatCurrency(line.unit_price)}
//                   </Text>
//                 </Table.Td>
//                 <Table.Td style={{ textAlign: 'right' }}>
//                   <Text size="sm" fw={600} ff="monospace">
//                     {formatCurrency(line.line_total)}
//                   </Text>
//                 </Table.Td>
//               </Table.Tr>
//             ))}
//           </Table.Tbody>
//         </Table>
//       </SectionCard>

//       {/* ---------------- Discounts ---------------- */}
//       {b.discounts && b.discounts.length > 0 && (
//         <SectionCard icon={<Percent size={15} />} title="Discounts">
//           <Stack gap="md">
//             {b.discounts.map((d, i) => (
//               <Box key={d.id}>
//                 {i > 0 && <Divider mb="md" />}
//                 <Group justify="space-between" align="flex-start" wrap="nowrap">
//                   <Stack gap={2}>
//                     <Text size="sm" fw={500}>
//                       {d.reason}
//                     </Text>
//                     <Text size="xs" c="dimmed">
//                       By {d.authorized_by_user?.full_name || '-'} •{' '}
//                       {formatDateTime(d.authorized_at)}
//                     </Text>
//                   </Stack>
//                   <Text c="red.7" fw={600} ff="monospace" size="sm">
//                     -{formatCurrency(d.amount)}
//                   </Text>
//                 </Group>
//               </Box>
//             ))}
//           </Stack>
//         </SectionCard>
//       )}

//       {/* ---------------- Payment ---------------- */}
//       {b.payment && (
//         <SectionCard
//           icon={<CreditCard size={15} />}
//           title="Payment"
//           right={<StatBadge value={b.payment.status} />}
//           noPadding
//         >
//           {/* Meta row */}
//           <Group
//             justify="space-between"
//             px="lg"
//             py="sm"
//             style={{
//               background: 'var(--mantine-color-gray-0)',
//               borderBottom: '1px solid var(--mantine-color-gray-2)',
//             }}
//           >
//             <Text size="xs" c="dimmed" fw={600} tt="uppercase" style={{ letterSpacing: 0.6 }}>
//               Payment Ref
//             </Text>
//             <Text size="sm" fw={600} ff="monospace">
//               {b.payment.payment_ref}
//             </Text>
//           </Group>

//           <Table
//             horizontalSpacing="lg"
//             verticalSpacing="sm"
//             highlightOnHover
//             highlightOnHoverColor="var(--mantine-color-gray-0)"
//             styles={{
//               th: {
//                 background: 'var(--mantine-color-gray-0)',
//                 color: 'var(--mantine-color-gray-6)',
//                 fontWeight: 600,
//                 fontSize: 11,
//                 letterSpacing: 0.6,
//                 textTransform: 'uppercase',
//                 borderBottom: '1px solid var(--mantine-color-gray-2)',
//               },
//               td: {
//                 borderBottom: '1px solid var(--mantine-color-gray-1)',
//                 fontSize: 13.5,
//               },
//               tr: {
//                 '&:last-of-type td': { borderBottom: 'none' },
//               },
//             }}
//           >
//             <Table.Thead>
//               <Table.Tr>
//                 <Table.Th>Method</Table.Th>
//                 <Table.Th>Reference</Table.Th>
//                 <Table.Th>Status</Table.Th>
//                 <Table.Th style={{ textAlign: 'right' }}>Amount</Table.Th>
//               </Table.Tr>
//             </Table.Thead>
//             <Table.Tbody>
//               {b.payment.payment_lines?.map((pl) => (
//                 <Table.Tr key={pl.id}>
//                   <Table.Td>
//                     <StatBadge value={pl.method} />
//                   </Table.Td>
//                   <Table.Td>
//                     <Text size="sm" c={pl.transaction_ref ? undefined : 'dimmed'} ff="monospace">
//                       {pl.transaction_ref || '-'}
//                     </Text>
//                   </Table.Td>
//                   <Table.Td>
//                     <StatBadge value={pl.verification_status} />
//                   </Table.Td>
//                   <Table.Td style={{ textAlign: 'right' }}>
//                     <Text size="sm" fw={600} ff="monospace">
//                       {formatCurrency(pl.amount)}
//                     </Text>
//                   </Table.Td>
//                 </Table.Tr>
//               ))}
//             </Table.Tbody>
//           </Table>
//         </SectionCard>
//       )}

//       <ApplyDiscountModal
//         opened={discountOpen}
//         onClose={closeDiscount}
//         billId={id}
//         maxAmount={parseFloat(b.net_total)}
//       />

//       <RecordPaymentModal
//         opened={paymentOpen}
//         onClose={closePayment}
//         billId={id}
//         billNetTotal={parseFloat(b.net_total)}
//       />
//     </>
//   );
// }





































import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Button,
  Card,
  Grid,
  Group,
  Stack,
  Table,
  Text,
  Title,
  Box,
  Divider,
  ThemeIcon,
  Badge,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ArrowLeft,
  Banknote,
  Percent,
  Receipt,
  CreditCard,
  Printer,
} from 'lucide-react';
import { useBill } from '@/hooks/useOrders';
import { useAuth } from '@/lib/auth/useAuth';
import { PageHeader } from '@/components/PageHeader';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { StatBadge } from '@/components/StatBadge';
import { ApplyDiscountModal } from '@/components/orders/ApplyDiscountModal';
import { RecordPaymentModal } from '@/components/payments/RecordPaymentModal';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';

export const Route = createFileRoute('/_app/bills/$id')({
  component: BillDetailPage,
});

/* -------------------------------------------------------------- */
/*  Summary cell - small, quiet label + strong mono number        */
/* -------------------------------------------------------------- */
function SummaryCell({
  label,
  value,
  accent,
  emphasis,
}: {
  label: string;
  value: string;
  accent?: 'red' | 'blue' | 'gray';
  emphasis?: boolean;
}) {
  const color =
    accent === 'red'
      ? 'red.7'
      : accent === 'blue'
      ? 'blue.7'
      : emphasis
      ? 'gray.9'
      : undefined;

  return (
    <Box
      p="md"
      style={{
        borderRight: '1px solid var(--mantine-color-gray-2)',
        height: '100%',
      }}
    >
      <Text
        size="xs"
        c="dimmed"
        fw={600}
        tt="uppercase"
        style={{ letterSpacing: 0.6 }}
        mb={6}
      >
        {label}
      </Text>
      <Text
        fw={emphasis ? 700 : 600}
        size={emphasis ? 'xl' : 'lg'}
        c={color}
        ff="monospace"
        style={{ letterSpacing: '-0.02em' }}
      >
        {value}
      </Text>
    </Box>
  );
}

/* -------------------------------------------------------------- */
/*  Section card - consistent header style for every block        */
/* -------------------------------------------------------------- */
function SectionCard({
  icon,
  title,
  right,
  children,
  noPadding,
}: {
  icon: React.ReactNode;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
}) {
  return (
    <Card
      withBorder
      radius="md"
      p={0}
      mb="lg"
      style={{ overflow: 'hidden' }}
    >
      <Group
        justify="space-between"
        px="lg"
        py="md"
        style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
      >
        <Group gap="sm">
          <ThemeIcon size={28} radius="md" variant="light" color="blue">
            {icon}
          </ThemeIcon>
          <Text fw={600} size="sm">
            {title}
          </Text>
        </Group>
        {right}
      </Group>
      <Box p={noPadding ? 0 : 'lg'}>{children}</Box>
    </Card>
  );
}

function BillDetailPage() {
  const { id } = Route.useParams();
  const auth = useAuth();
  const bill = useBill(id);
  const [discountOpen, { open: openDiscount, close: closeDiscount }] =
    useDisclosure(false);
  const [paymentOpen, { open: openPayment, close: closePayment }] =
    useDisclosure(false);

  if (bill.isLoading) return <LoadingState />;
  if (bill.error || !bill.data) return <EmptyState title="Bill not found" />;

  const b = bill.data;
  const canDiscount =
    b.status === 'open' && auth.hasPermission('bill.discount');
  const canPay = b.status === 'open' && auth.hasPermission('payment.record');

  const hasDiscount = parseFloat(b.discount_total) > 0;

  return (
    <>
      {/* Back link */}
      <Button
        component={Link}
        to="/bills"
        variant="subtle"
        color="gray"
        size="sm"
        leftSection={<ArrowLeft size={15} />}
        mb="md"
        px="xs"
      >
        Back to bills
      </Button>

      <PageHeader
        title={b.bill_ref}
        subtitle={`Customer: ${b.customer_code} • Waiter: ${b.waiter?.full_name || '-'}`}
        actions={
          <Group gap="sm">
            <StatBadge value={b.status} />
            <Button
              leftSection={<Printer size={15} />}
              variant="light"
              radius="md"
              onClick={() => window.open(`/bill/${b.id}`, '_blank')}
            >
              Print
            </Button>
            {canDiscount && (
              <Button
                leftSection={<Percent size={15} />}
                variant="light"
                radius="md"
                onClick={openDiscount}
              >
                Apply Discount
              </Button>
            )}
            {canPay && (
              <Button
                leftSection={<Banknote size={15} />}
                radius="md"
                onClick={openPayment}
              >
                Record Payment
              </Button>
            )}
          </Group>
        }
      />

      {/* ---------------- Summary strip ---------------- */}
      <Card
        withBorder
        radius="md"
        p={0}
        mb="lg"
        style={{ overflow: 'hidden' }}
      >
        <Grid>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <SummaryCell label="Gross" value={formatCurrency(b.gross_total)} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <SummaryCell
              label="Discount"
              value={
                hasDiscount
                  ? `-${formatCurrency(b.discount_total)}`
                  : formatCurrency(0)
              }
              accent={hasDiscount ? 'red' : 'gray'}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Box
              p="md"
              style={{ background: 'var(--mantine-color-blue-0)' }}
            >
              <Text
                size="xs"
                c="blue.8"
                fw={600}
                tt="uppercase"
                style={{ letterSpacing: 0.6 }}
                mb={6}
              >
                Net Total
              </Text>
              <Text
                fw={700}
                size="xl"
                c="blue.9"
                ff="monospace"
                style={{ letterSpacing: '-0.02em' }}
              >
                {formatCurrency(b.net_total)}
              </Text>
            </Box>
          </Grid.Col>
        </Grid>
      </Card>

      {/* ---------------- Bill lines ---------------- */}
      <SectionCard
        icon={<Receipt size={15} />}
        title="Bill Lines"
        right={
          <Badge variant="light" color="gray" radius="sm" size="md">
            {b.bill_lines?.length ?? 0} item
            {(b.bill_lines?.length ?? 0) === 1 ? '' : 's'}
          </Badge>
        }
        noPadding
      >
        <Table
          horizontalSpacing="lg"
          verticalSpacing="sm"
          highlightOnHover
          highlightOnHoverColor="var(--mantine-color-gray-0)"
          styles={{
            th: {
              background: 'var(--mantine-color-gray-0)',
              color: 'var(--mantine-color-gray-6)',
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              borderBottom: '1px solid var(--mantine-color-gray-2)',
            },
            td: {
              borderBottom: '1px solid var(--mantine-color-gray-1)',
              fontSize: 13.5,
            },
            tr: {
              '&:last-of-type td': { borderBottom: 'none' },
            },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Description</Table.Th>
              <Table.Th style={{ textAlign: 'right', width: 80 }}>Qty</Table.Th>
              <Table.Th style={{ textAlign: 'right', width: 140 }}>
                Unit Price
              </Table.Th>
              <Table.Th style={{ textAlign: 'right', width: 140 }}>Total</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {b.bill_lines?.map((line) => (
              <Table.Tr key={line.id}>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {line.description}
                  </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text size="sm" c="dimmed" ff="monospace">
                    {line.quantity}
                  </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text size="sm" c="dimmed" ff="monospace">
                    {formatCurrency(line.unit_price)}
                  </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text size="sm" fw={600} ff="monospace">
                    {formatCurrency(line.line_total)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </SectionCard>

      {/* ---------------- Discounts ---------------- */}
      {b.discounts && b.discounts.length > 0 && (
        <SectionCard icon={<Percent size={15} />} title="Discounts">
          <Stack gap="md">
            {b.discounts.map((d, i) => (
              <Box key={d.id}>
                {i > 0 && <Divider mb="md" />}
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Stack gap={2}>
                    <Text size="sm" fw={500}>
                      {d.reason}
                    </Text>
                    <Text size="xs" c="dimmed">
                      By {d.authorized_by_user?.full_name || '-'} •{' '}
                      {formatDateTime(d.authorized_at)}
                    </Text>
                  </Stack>
                  <Text c="red.7" fw={600} ff="monospace" size="sm">
                    -{formatCurrency(d.amount)}
                  </Text>
                </Group>
              </Box>
            ))}
          </Stack>
        </SectionCard>
      )}

      {/* ---------------- Payment ---------------- */}
      {b.payment && (
        <SectionCard
          icon={<CreditCard size={15} />}
          title="Payment"
          right={<StatBadge value={b.payment.status} />}
          noPadding
        >
          {/* Meta row */}
          <Group
            justify="space-between"
            px="lg"
            py="sm"
            style={{
              background: 'var(--mantine-color-gray-0)',
              borderBottom: '1px solid var(--mantine-color-gray-2)',
            }}
          >
            <Text
              size="xs"
              c="dimmed"
              fw={600}
              tt="uppercase"
              style={{ letterSpacing: 0.6 }}
            >
              Payment Ref
            </Text>
            <Text size="sm" fw={600} ff="monospace">
              {b.payment.payment_ref}
            </Text>
          </Group>

          <Table
            horizontalSpacing="lg"
            verticalSpacing="sm"
            highlightOnHover
            highlightOnHoverColor="var(--mantine-color-gray-0)"
            styles={{
              th: {
                background: 'var(--mantine-color-gray-0)',
                color: 'var(--mantine-color-gray-6)',
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: 0.6,
                textTransform: 'uppercase',
                borderBottom: '1px solid var(--mantine-color-gray-2)',
              },
              td: {
                borderBottom: '1px solid var(--mantine-color-gray-1)',
                fontSize: 13.5,
              },
              tr: {
                '&:last-of-type td': { borderBottom: 'none' },
              },
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Method</Table.Th>
                <Table.Th>Reference</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Amount</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {b.payment.payment_lines?.map((pl) => (
                <Table.Tr key={pl.id}>
                  <Table.Td>
                    <StatBadge value={pl.method} />
                  </Table.Td>
                  <Table.Td>
                    <Text
                      size="sm"
                      c={pl.transaction_ref ? undefined : 'dimmed'}
                      ff="monospace"
                    >
                      {pl.transaction_ref || '-'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <StatBadge value={pl.verification_status} />
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    <Text size="sm" fw={600} ff="monospace">
                      {formatCurrency(pl.amount)}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </SectionCard>
      )}

      <ApplyDiscountModal
        opened={discountOpen}
        onClose={closeDiscount}
        billId={id}
        maxAmount={parseFloat(b.net_total)}
      />

      <RecordPaymentModal
        opened={paymentOpen}
        onClose={closePayment}
        billId={id}
        billNetTotal={parseFloat(b.net_total)}
      />
    </>
  );
}