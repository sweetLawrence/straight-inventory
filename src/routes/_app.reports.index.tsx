// import { createFileRoute } from '@tanstack/react-router';
// import {
//   Badge,
//   Card,
//   Grid,
//   Group,
//   Loader,
//   Select,
//   SimpleGrid,
//   Stack,
//   Table,
//   Text,
//   Title,
// } from '@mantine/core';
// import { useMemo, useState } from 'react';
// import {
//   useBillsReport,
//   usePaymentsReport,
//   useExceptionsReport,
//   usePropertiesForReports,
// } from '@/hooks/useReports';
// import { useAuth } from '@/lib/auth/useAuth';
// import { PageHeader } from '@/components/PageHeader';
// import { DateRangeSelector } from '@/components/reports/DateRangeSelector';
// import { SummaryCard } from '@/components/reports/SummaryCard';
// import { SalesByWaiterTable } from '@/components/reports/SalesByWaiterTable';
// import { SalesByMethodTable } from '@/components/reports/SalesByMethodTable';
// import { SalesByPropertyTable } from '@/components/reports/SalesByPropertyTable';
// import { DateRange } from '@/lib/api/reports';
// import { formatCurrency } from '@/lib/utils/format';
// import dayjs from 'dayjs';

// export const Route = createFileRoute('/_app/reports/')({
//   component: ReportsPage,
// });

// function ReportsPage() {
//   const auth = useAuth();
//   const properties = usePropertiesForReports();

//   const [range, setRange] = useState<DateRange>({
//     from: dayjs().format('YYYY-MM-DD'),
//     to: dayjs().format('YYYY-MM-DD'),
//   });

//   // MD/admin have no primary_property_id → can pick any property or all
//   const isGroupLevel = !auth.user?.primary_property_id;

//   const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');

//   const propertyFilter = useMemo(() => {
//     if (isGroupLevel) {
//       return selectedPropertyId === 'all' ? undefined : selectedPropertyId;
//     }
//     return auth.user?.primary_property_id || undefined;
//   }, [isGroupLevel, selectedPropertyId, auth.user]);

//   const bills = useBillsReport(range, propertyFilter);
//   const payments = usePaymentsReport(range, propertyFilter);
//   const exceptions = useExceptionsReport(range, propertyFilter);

//   const totalSales = useMemo(() => {
//     return (bills.data ?? []).reduce(
//       (sum, b) => sum + parseFloat(b.net_total),
//       0
//     );
//   }, [bills.data]);

//   const billCount = bills.data?.length ?? 0;
//   const avgBill = billCount > 0 ? totalSales / billCount : 0;

//   const openExceptions = useMemo(() => {
//     return (exceptions.data ?? []).filter((e) => e.status === 'open').length;
//   }, [exceptions.data]);

//   const isLoading =
//     bills.isLoading || payments.isLoading || exceptions.isLoading;

//   const propertyOptions = [
//     { value: 'all', label: 'All Properties (Group)' },
//     ...(properties.data ?? []).map((p) => ({
//       value: p.id,
//       label: `${p.code} - ${p.name}`,
//     })),
//   ];

//   const subtitle = useMemo(() => {
//     if (isGroupLevel) {
//       if (selectedPropertyId === 'all') return 'Consolidated across all properties';
//       const p = properties.data?.find((x) => x.id === selectedPropertyId);
//       return p ? `${p.code} - ${p.name}` : 'Selected property';
//     }
//     const code = auth.user?.roles[0]?.property_code || 'Your property';
//     return `${code} - your property`;
//   }, [isGroupLevel, selectedPropertyId, properties.data, auth.user]);

//   return (
//     <>
//       <PageHeader
//         title="Reports"
//         subtitle={subtitle}
//         actions={
//           isGroupLevel ? (
//             <Select
//               data={propertyOptions}
//               value={selectedPropertyId}
//               onChange={(v) => setSelectedPropertyId(v || 'all')}
//               w={250}
//             />
//           ) : undefined
//         }
//       />

//       <Group mb="lg">
//         <DateRangeSelector value={range} onChange={setRange} />
//       </Group>

//       {isLoading ? (
//         <Stack align="center" py="xl">
//           <Loader />
//         </Stack>
//       ) : (
//         <>
//           <SimpleGrid cols={{ base: 1, sm: 3 }} mb="lg">
//             <SummaryCard
//               label="Total Sales"
//               value={formatCurrency(totalSales)}
//               sublabel={`${billCount} bills`}
//             />
//             <SummaryCard
//               label="Average Bill"
//               value={formatCurrency(avgBill)}
//             />
//             <SummaryCard
//               label="Open Exceptions"
//               value={openExceptions}
//               sublabel={openExceptions > 0 ? 'Need attention' : 'All clear'}
//             />
//           </SimpleGrid>

//           <Grid mb="lg">
//             <Grid.Col span={{ base: 12, md: 6 }}>
//               <SalesByWaiterTable bills={bills.data ?? []} />
//             </Grid.Col>
//             <Grid.Col span={{ base: 12, md: 6 }}>
//               <SalesByMethodTable payments={payments.data ?? []} />
//             </Grid.Col>
//           </Grid>

//           {/* Sales by Property only when MD is in "All" mode */}
//           {isGroupLevel && selectedPropertyId === 'all' && (
//             <Grid mb="lg">
//               <Grid.Col span={12}>
//                 <SalesByPropertyTable bills={bills.data ?? []} />
//               </Grid.Col>
//             </Grid>
//           )}

//           <Card withBorder mt="lg">
//             <Title order={5} mb="sm">
//               Exceptions in Range
//             </Title>
//             {(exceptions.data ?? []).length === 0 ? (
//               <Text c="dimmed" size="sm" ta="center" py="md">
//                 No exceptions in this period.
//               </Text>
//             ) : (
//               <Table striped>
//                 <Table.Thead>
//                   <Table.Tr>
//                     <Table.Th>Ref</Table.Th>
//                     <Table.Th>Type</Table.Th>
//                     <Table.Th>Severity</Table.Th>
//                     <Table.Th>Status</Table.Th>
//                     <Table.Th style={{ textAlign: 'right' }}>Amount</Table.Th>
//                   </Table.Tr>
//                 </Table.Thead>
//                 <Table.Tbody>
//                   {exceptions.data!.map((e) => (
//                     <Table.Tr key={e.id}>
//                       <Table.Td>
//                         <Text size="sm">{e.exception_ref}</Text>
//                       </Table.Td>
//                       <Table.Td>
//                         <Text size="sm">
//                           {e.exception_type.replace(/_/g, ' ')}
//                         </Text>
//                       </Table.Td>
//                       <Table.Td>
//                         <Badge
//                           color={
//                             e.severity === 'critical'
//                               ? 'red'
//                               : e.severity === 'high'
//                               ? 'orange'
//                               : e.severity === 'medium'
//                               ? 'yellow'
//                               : 'gray'
//                           }
//                           variant="light"
//                           size="sm"
//                         >
//                           {e.severity}
//                         </Badge>
//                       </Table.Td>
//                       <Table.Td>
//                         <Badge
//                           color={e.status === 'open' ? 'red' : 'gray'}
//                           variant="light"
//                           size="sm"
//                         >
//                           {e.status}
//                         </Badge>
//                       </Table.Td>
//                       <Table.Td style={{ textAlign: 'right' }}>
//                         {e.amount ? formatCurrency(e.amount) : '-'}
//                       </Table.Td>
//                     </Table.Tr>
//                   ))}
//                 </Table.Tbody>
//               </Table>
//             )}
//           </Card>
//         </>
//       )}
//     </>
//   );
// }

import { createFileRoute } from '@tanstack/react-router'
import {
  Badge,
  Box,
  Card,
  Divider,
  Grid,
  Group,
  Loader,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  Title,
  Tooltip
} from '@mantine/core'
import { useMemo, useState } from 'react'
import {
  useBillsReport,
  usePaymentsReport,
  useExceptionsReport,
  usePropertiesForReports
} from '@/hooks/useReports'
import { useAuth } from '@/lib/auth/useAuth'
import { PageHeader } from '@/components/PageHeader'
import { DateRangeSelector } from '@/components/reports/DateRangeSelector'
import { SummaryCard } from '@/components/reports/SummaryCard'
import { SalesByWaiterTable } from '@/components/reports/SalesByWaiterTable'
import { SalesByMethodTable } from '@/components/reports/SalesByMethodTable'
import { SalesByPropertyTable } from '@/components/reports/SalesByPropertyTable'
import { DateRange } from '@/lib/api/reports'
import { formatCurrency } from '@/lib/utils/format'
import dayjs from 'dayjs'

export const Route = createFileRoute('/_app/reports/')({
  component: ReportsPage
})

function ReportsPage () {
  const auth = useAuth()
  const properties = usePropertiesForReports()

  const [range, setRange] = useState<DateRange>({
    from: dayjs().format('YYYY-MM-DD'),
    to: dayjs().format('YYYY-MM-DD')
  })

  // MD/admin have no primary_property_id → can pick any property or all
  const isGroupLevel = !auth.user?.primary_property_id

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all')

  const propertyFilter = useMemo(() => {
    if (isGroupLevel) {
      return selectedPropertyId === 'all' ? undefined : selectedPropertyId
    }
    return auth.user?.primary_property_id || undefined
  }, [isGroupLevel, selectedPropertyId, auth.user])

  const bills = useBillsReport(range, propertyFilter)
  const payments = usePaymentsReport(range, propertyFilter)
  const exceptions = useExceptionsReport(range, propertyFilter)

  const totalSales = useMemo(() => {
    return (bills.data ?? []).reduce(
      (sum, b) => sum + parseFloat(b.net_total),
      0
    )
  }, [bills.data])

  const billCount = bills.data?.length ?? 0
  const avgBill = billCount > 0 ? totalSales / billCount : 0

  const openExceptions = useMemo(() => {
    return (exceptions.data ?? []).filter(e => e.status === 'open').length
  }, [exceptions.data])

  const isLoading =
    bills.isLoading || payments.isLoading || exceptions.isLoading

  const propertyOptions = [
    { value: 'all', label: 'All Properties (Group)' },
    ...(properties.data ?? []).map(p => ({
      value: p.id,
      label: `${p.code} - ${p.name}`
    }))
  ]

  const subtitle = useMemo(() => {
    if (isGroupLevel) {
      if (selectedPropertyId === 'all')
        return 'Consolidated across all properties'
      const p = properties.data?.find(x => x.id === selectedPropertyId)
      return p ? `${p.code} - ${p.name}` : 'Selected property'
    }
    const code = auth.user?.roles[0]?.property_code || 'Your property'
    return `${code} - your property`
  }, [isGroupLevel, selectedPropertyId, properties.data, auth.user])

  return (
    <>
      <PageHeader
        title='Reports'
        subtitle={subtitle}
        actions={
          isGroupLevel ? (
            <Select
              data={propertyOptions}
              value={selectedPropertyId}
              onChange={v => setSelectedPropertyId(v || 'all')}
              w={{ base: '100%', sm: 260 }}
              placeholder='Select property'
              checkIconPosition='right'
            />
          ) : undefined
        }
      />

      {/* Filter bar - full width on mobile, inline on desktop */}
      <Card withBorder p='sm' mb='lg' radius='md'>
        <Group justify='space-between' align='center' wrap='wrap' gap='sm'>
          <Group gap='xs'>
            <Text
              size='xs'
              fw={600}
              c='dimmed'
              tt='uppercase'
              style={{ letterSpacing: 0.5 }}
            >
              Period
            </Text>
          </Group>
          <Box style={{ flex: '1 1 auto', minWidth: 0 }}>
            <DateRangeSelector value={range} onChange={setRange} />
          </Box>
        </Group>
      </Card>

      {isLoading ? (
        <ReportsSkeleton />
      ) : (
        <>
          {/* Summary cards */}
          <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} mb='lg'>
            <SummaryCard
              label='Total Sales'
              value={formatCurrency(totalSales)}
              sublabel={`${billCount} bill${billCount === 1 ? '' : 's'}`}
            />
            <SummaryCard
              label='Average Bill'
              value={formatCurrency(avgBill)}
              sublabel={
                billCount > 0 ? `across ${billCount} bills` : 'No bills yet'
              }
            />
            <SummaryCard
              label='Open Exceptions'
              value={openExceptions}
              sublabel={openExceptions > 0 ? 'Need attention' : 'All clear'}
            />
          </SimpleGrid>

          {/* Breakdown tables - side by side on desktop, stacked on mobile */}
          <SimpleGrid cols={{ base: 1, lg: 2 }} mb='lg' spacing='lg'>
            <Box style={{ minWidth: 0 }}>
              <SalesByWaiterTable bills={bills.data ?? []} />
            </Box>
            <Box style={{ minWidth: 0 }}>
              <SalesByMethodTable payments={payments.data ?? []} />
            </Box>
          </SimpleGrid>

          {/* Sales by Property only when MD is in "All" mode */}
          {isGroupLevel && selectedPropertyId === 'all' && (
            <Box mb='lg' style={{ minWidth: 0 }}>
              <SalesByPropertyTable bills={bills.data ?? []} />
            </Box>
          )}

          {/* Exceptions */}
          <Card withBorder radius='md' p={0} style={{ overflow: 'hidden' }}>
            <Group justify='space-between' align='center' p='md' pb='sm'>
              <Box>
                <Title order={5} fw={600}>
                  Exceptions in Range
                </Title>
                <Text size='xs' c='dimmed' mt={2}>
                  {openExceptions > 0
                    ? `${openExceptions} open · ${
                        (exceptions.data ?? []).length
                      } total`
                    : `${(exceptions.data ?? []).length} total`}
                </Text>
              </Box>
              {openExceptions > 0 && (
                <Badge color='red' variant='light' size='lg' radius='sm'>
                  {openExceptions} open
                </Badge>
              )}
            </Group>

            <Divider />

            {(exceptions.data ?? []).length === 0 ? (
              <Stack align='center' py='xl' gap={4}>
                <Text c='dimmed' size='sm' fw={500}>
                  No exceptions in this period
                </Text>
                <Text c='dimmed' size='xs'>
                  Everything looks clean for the selected range.
                </Text>
              </Stack>
            ) : (
              <ExceptionsTable exceptions={exceptions.data!} />
            )}
          </Card>
        </>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Exceptions table - scrolls horizontally instead of squashing      */
/* ------------------------------------------------------------------ */

function ExceptionsTable ({
  exceptions
}: {
  exceptions: NonNullable<ReturnType<typeof useExceptionsReport>['data']>
}) {
  return (
    <Box style={{ overflowX: 'auto' }}>
      <Table
        highlightOnHover
        verticalSpacing='sm'
        horizontalSpacing='md'
        style={{ minWidth: 640 }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Ref</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Severity</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th style={{ textAlign: 'right' }}>Amount</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {exceptions.map(e => (
            <Table.Tr key={e.id}>
              <Table.Td>
                <Text size='sm' fw={500}>
                  {e.exception_ref}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size='sm' c='dimmed'>
                  {e.exception_type.replace(/_/g, ' ')}
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge
                  color={
                    e.severity === 'critical'
                      ? 'red'
                      : e.severity === 'high'
                      ? 'orange'
                      : e.severity === 'medium'
                      ? 'yellow'
                      : 'gray'
                  }
                  variant='light'
                  size='sm'
                  radius='sm'
                >
                  {e.severity}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Badge
                  color={e.status === 'open' ? 'red' : 'gray'}
                  variant='light'
                  size='sm'
                  radius='sm'
                >
                  {e.status}
                </Badge>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text size='sm' fw={500}>
                  {e.amount ? formatCurrency(e.amount) : '-'}
                </Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  )
}

/* ------------------------------------------------------------------ */
/*  Skeleton loader - mirrors the real layout so nothing jumps        */
/* ------------------------------------------------------------------ */

function ReportsSkeleton () {
  return (
    <>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} mb='lg'>
        {[0, 1, 2].map(i => (
          <Card key={i} withBorder radius='md' p='md'>
            <Skeleton height={12} width={90} mb='sm' />
            <Skeleton height={28} width={140} mb='xs' />
            <Skeleton height={10} width={70} />
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} mb='lg' spacing='lg'>
        {[0, 1].map(i => (
          <Card key={i} withBorder radius='md' p='md'>
            <Skeleton height={16} width={140} mb='md' />
            {[0, 1, 2, 3].map(r => (
              <Skeleton key={r} height={14} mb='xs' />
            ))}
          </Card>
        ))}
      </SimpleGrid>

      <Card withBorder radius='md' p='md'>
        <Skeleton height={16} width={160} mb='md' />
        {[0, 1, 2].map(r => (
          <Skeleton key={r} height={14} mb='xs' />
        ))}
      </Card>
    </>
  )
}
