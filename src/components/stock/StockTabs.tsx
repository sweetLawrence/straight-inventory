import { Tabs } from '@mantine/core';
import { useNavigate, useRouterState } from '@tanstack/react-router';

const tabs = [
  { label: 'Batches', to: '/stock/batches' },
  { label: 'Portion', to: '/stock/portion-inventory' },
  { label: 'Ledger', to: '/stock/ledger' },
  { label: 'Balance', to: '/stock/balance' },
  { label: 'Bulk Issues', to: '/stock/bulk-issues' },
];

export function StockTabs() {
  const navigate = useNavigate();
  const router = useRouterState();
  const current = router.location.pathname;

  const active = tabs.find((t) => current.startsWith(t.to))?.to || tabs[0].to;

  return (
    <Tabs
      value={active}
      onChange={(value) => value && navigate({ to: value })}
      mb="lg"
    >
      <Tabs.List>
        {tabs.map((t) => (
          <Tabs.Tab key={t.to} value={t.to}>
            {t.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}