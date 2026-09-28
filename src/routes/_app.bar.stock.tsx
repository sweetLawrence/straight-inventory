// import { createFileRoute } from '@tanstack/react-router';
// import { Badge, Text } from '@mantine/core';
// import { useState } from 'react';
// import { useStockItems } from '@/hooks/useStock';
// import { PageHeader } from '@/components/PageHeader';
// import { DataTable, Column } from '@/components/DataTable';
// import { StockItem } from '@/lib/api/stock';
// import { formatNumber } from '@/lib/utils/format';

// export const Route = createFileRoute('/_app/bar/stock')({
//   component: BarStockPage,
// });

// function BarStockPage() {
//   const [page, setPage] = useState(1);
//   const query = useStockItems({
//     page,
//     limit: 20,
//     store_type: 'bar_store',
//   });

//   const columns: Column<StockItem>[] = [
//     {
//       key: 'item',
//       header: 'Item',
//       render: (r) => <Text fw={500}>{r.item?.name || '-'}</Text>,
//     },
//     {
//       key: 'code',
//       header: 'Code',
//       render: (r) => <Text size="sm" c="dimmed">{r.item?.code}</Text>,
//     },
//     {
//       key: 'model',
//       header: 'Type',
//       render: (r) => (
//         <Badge variant="light" color="grape">
//           {r.stock_model}
//         </Badge>
//       ),
//     },
//     {
//       key: 'reorder',
//       header: 'Reorder at',
//       align: 'right',
//       render: (r) => (r.reorder_level ? formatNumber(r.reorder_level) : '-'),
//     },
//   ];

//   return (
//     <>
//       <PageHeader title="Bar Stock" subtitle="Only bar-store items" />
//       <DataTable
//         data={query.data?.data ?? []}
//         columns={columns}
//         loading={query.isLoading}
//         error={query.error ? 'Failed to load bar stock' : null}
//         rowKey={(r) => r.id}
//         meta={query.data?.meta}
//         onPageChange={setPage}
//         emptyTitle="No bar stock"
//         emptyDescription="Bar-store items will appear here."
//       />
//     </>
//   );
// }

import { createFileRoute } from '@tanstack/react-router'
import { Badge, Text } from '@mantine/core'
import { useState } from 'react'
import { useStockItems } from '@/hooks/useStock'
import { PageHeader } from '@/components/PageHeader'
import { DataTable, Column } from '@/components/DataTable'
import { StockItem } from '@/lib/api/stock'
import { formatNumber } from '@/lib/utils/format'

export const Route = createFileRoute('/_app/bar/stock')({
  component: BarStockPage
})

function BarStockPage () {
  const [page, setPage] = useState(1)
  const query = useStockItems({ page, limit: 20, store_type: 'bar_store' })

  const columns: Column<StockItem>[] = [
    {
      key: 'item',
      header: 'Item',
      render: r => <Text fw={500}>{r.item?.name || '-'}</Text>
    },
    {
      key: 'code',
      header: 'Code',
      render: r => (
        <Text size='sm' c='dimmed'>
          {r.item?.code}
        </Text>
      )
    },
    {
      key: 'model',
      header: 'Type',
      render: r => (
        <Badge variant='light' color='grape'>
          {r.stock_model}
        </Badge>
      )
    },
    {
      key: 'reorder',
      header: 'Reorder at',
      align: 'right',
      render: r => (r.reorder_level ? formatNumber(r.reorder_level) : '-')
    }
  ]

  return (
    <>
      <PageHeader title='Bar Stock' subtitle='Only bar-store items' />
      <DataTable
        data={query.data?.data ?? []}
        columns={columns}
        loading={query.isLoading}
        error={query.error ? 'Failed to load bar stock' : null}
        rowKey={r => r.id}
        meta={query.data?.meta}
        onPageChange={setPage}
        emptyTitle='No bar stock'
        emptyDescription='Bar-store items will appear here.'
      />
    </>
  )
}
