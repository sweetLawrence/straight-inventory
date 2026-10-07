import { CSSProperties, ReactNode, useEffect } from 'react';
import { ActionIcon, Avatar, Box, Drawer, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ArrowLeftRight,
  Banknote,
  BarChart3,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FileText,
  GlassWater,
  House,
  LogOut,
  Package,
  Receipt,
  Scale,
  ShieldCheck,
  SquarePlus,
  Truck,
  UtensilsCrossed,
  Users,
  Wallet,
  Warehouse,
  Wine,
  Wrench,
} from 'lucide-react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth/useAuth';
import { useBarPending, useOrders } from '@/hooks/useOrders';

/**
 * Instagram-style phone shell: header with logo, name and logout, an icon tab bar
 * with small labels, and a "More" sheet. Each role gets its own four tabs.
 */

export type MobileRole = 'waiter' | 'bar' | 'manager';

const C = {
  ink: '#111111',
  inactive: '#262626',
  muted: '#737373',
  line: '#DBDBDB',
  bg: '#FFFFFF',
  page: '#FAFAFA',
  danger: '#ED4956',
  badge: '#FF3040',
  avatarBg: '#EFEFEF',
};

const stroke = (active: boolean) => (active ? 2.6 : 1.8);
const ic = (Icon: typeof House, size = 24) => (a: boolean) => <Icon size={size} strokeWidth={stroke(a)} />;
const li = (Icon: typeof House) => <Icon size={20} strokeWidth={1.8} />;

interface Tab {
  label: string;
  to: string;
  icon: (active: boolean) => ReactNode;
  exact?: boolean;
  /** Small red count, e.g. drinks waiting to pour */
  badge?: () => ReactNode;
}
interface MoreLink {
  label: string;
  to: string;
  icon: ReactNode;
  perm?: string;
}
interface MoreGroup {
  title?: string;
  links: MoreLink[];
}

// ─── Live counts on tabs ────────────────────────────────────────────
function CountBadge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <Box
      component="span"
      style={{
        position: 'absolute',
        top: -4,
        right: -10,
        minWidth: 16,
        height: 16,
        padding: '0 4px',
        borderRadius: 8,
        background: C.badge,
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 700,
        lineHeight: '16px',
        textAlign: 'center',
        border: `2px solid ${C.bg}`,
        boxSizing: 'content-box',
      }}
    >
      {n > 99 ? '99+' : n}
    </Box>
  );
}
function BarPendingBadge() {
  const q = useBarPending(1, 1);
  return <CountBadge n={q.data?.meta?.total ?? q.data?.data?.length ?? 0} />;
}
function ApprovalsBadge() {
  const q = useOrders({ page: 1, limit: 1, approval_status: 'pending' });
  return <CountBadge n={q.data?.meta?.total ?? 0} />;
}

// ─── Per-role layout ────────────────────────────────────────────────
const CONFIG: Record<MobileRole, { roleLabel: string; tabs: Tab[]; more: MoreGroup[] }> = {
  waiter: {
    roleLabel: 'Waiter',
    tabs: [
      { label: 'Home', to: '/dashboard', icon: ic(House) },
      { label: 'Orders', to: '/orders', icon: ic(Receipt) },
      { label: 'New', to: '/orders/new', exact: true, icon: ic(SquarePlus, 26) },
      { label: 'Bills', to: '/bills', icon: ic(FileText) },
    ],
    more: [
      {
        links: [
          { label: 'Payments', to: '/payments', icon: li(Banknote) },
          { label: 'Cash drops', to: '/cash-drops', icon: li(ArrowLeftRight) },
          { label: 'Float', to: '/float', icon: li(Wallet) },
          { label: 'My handover', to: '/handover', icon: li(ClipboardCheck) },
        ],
      },
    ],
  },
  bar: {
    roleLabel: 'Bar',
    tabs: [
      { label: 'Home', to: '/bar', exact: true, icon: ic(House) },
      { label: 'Orders', to: '/bar/orders', icon: ic(GlassWater), badge: () => <BarPendingBadge /> },
      { label: 'Stock', to: '/bar/stock', icon: ic(Wine) },
      { label: 'Handover', to: '/bar/handover', icon: ic(ClipboardCheck) },
    ],
    more: [
      {
        links: [
          { label: 'Bills', to: '/bills', icon: li(FileText) },
          { label: 'Payments', to: '/payments', icon: li(Banknote) },
          { label: 'Cash drops', to: '/cash-drops', icon: li(ArrowLeftRight) },
          { label: 'Float', to: '/float', icon: li(Wallet) },
          { label: 'Bar reports', to: '/bar/reports', icon: li(BarChart3) },
        ],
      },
    ],
  },
  manager: {
    roleLabel: 'Manager',
    tabs: [
      { label: 'Home', to: '/dashboard', icon: ic(House) },
      { label: 'Approvals', to: '/bar-approvals', icon: ic(ShieldCheck), badge: () => <ApprovalsBadge /> },
      { label: 'Bar', to: '/bar', icon: ic(Wine) },
      { label: 'Reports', to: '/reports', icon: ic(BarChart3) },
    ],
    more: [
      {
        title: 'Sales and cash',
        links: [
          { label: 'Orders', to: '/orders', icon: li(Receipt) },
          { label: 'Bills', to: '/bills', icon: li(FileText) },
          { label: 'Payments', to: '/payments', icon: li(Banknote) },
          { label: 'Pending verification', to: '/payments/pending', icon: li(ClipboardCheck), perm: 'payment.verify' },
          { label: 'Cash drops', to: '/cash-drops', icon: li(ArrowLeftRight) },
          { label: 'Float', to: '/float', icon: li(Wallet) },
        ],
      },
      {
        title: 'Store and stock',
        links: [
          { label: 'Dispatch queue', to: '/store/queue', icon: li(Truck) },
          { label: 'Stock balance', to: '/stock/balance', icon: li(Warehouse) },
          { label: 'Portion inventory', to: '/stock/portion-inventory', icon: li(Package) },
          { label: 'Transfers', to: '/transfers', icon: li(ArrowLeftRight) },
          { label: 'Staff meals', to: '/staff-meals', icon: li(UtensilsCrossed) },
        ],
      },
      {
        title: 'Controls',
        links: [
          { label: 'Waste', to: '/waste', icon: li(Wrench) },
          { label: 'Adjustments', to: '/adjustments', icon: li(Scale) },
          { label: 'Reconciliation', to: '/reconciliation', icon: li(ClipboardList) },
          { label: 'Users', to: '/users', icon: li(Users), perm: 'user.manage' },
        ],
      },
    ],
  },
};

const match = (path: string, to: string) => path === to || path.startsWith(to + '/');

export function AppShellMobile({ role = 'waiter', children }: { role?: MobileRole; children?: ReactNode }) {
  const auth = useAuth();
  const [sheet, { open, close }] = useDisclosure(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const cfg = CONFIG[role];

  // Let pages with their own sticky bars sit above the bottom nav
  // (e.g. New Order's Cancel / Create bar): bottom: var(--bottom-nav-height, 0px)
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--bottom-nav-height', 'calc(60px + env(safe-area-inset-bottom))');
    root.setProperty('--bottom-nav-safe-area', '0px');
    return () => {
      root.removeProperty('--bottom-nav-height');
      root.removeProperty('--bottom-nav-safe-area');
    };
  }, []);

  const tabPaths = cfg.tabs.map((t) => t.to);
  const isActive = (tab: Tab) => {
    if (tab.exact) return path === tab.to;
    if (!match(path, tab.to)) return false;
    // A longer tab path wins (e.g. /orders/new belongs to New, not Orders)
    return !tabPaths.some((p) => p !== tab.to && p.startsWith(tab.to + '/') && match(path, p));
  };
  const moreLinks = cfg.more
    .flatMap((g) => g.links)
    .filter((l) => !l.perm || auth.hasPermission(l.perm));
  const inMore = !cfg.tabs.some(isActive) && moreLinks.some((l) => match(path, l.to));

  const user = auth.user;
  const initial = user?.full_name?.[0]?.toUpperCase() ?? '?';
  const property = user?.roles[0]?.property_code;

  const logout = () => {
    auth.logout();
    window.location.replace('/login');
  };

  return (
    <Box style={{ minHeight: '100dvh', background: C.page }}>
      {/* ─── Header: logo · name · logout ─── */}
      <Box
        component="header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          paddingTop: 'env(safe-area-inset-top)',
          background: C.bg,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <Group h={56} px={12} justify="space-between" wrap="nowrap" gap="sm">
          <Group gap={10} wrap="nowrap" style={{ minWidth: 0 }}>
            <Box
              aria-label="Straight Inventory"
              style={{
                width: 34,
                height: 34,
                flexShrink: 0,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                background: 'linear-gradient(135deg, #228BE6 0%, #15AABF 100%)',
              }}
            >
              <Package size={18} />
            </Box>
            <Box style={{ minWidth: 0 }}>
              <Text fw={700} size="sm" lh={1.2} truncate style={{ color: C.ink }}>
                {user?.full_name}
              </Text>
              <Text size="xs" lh={1.2} truncate style={{ color: C.muted }}>
                {cfg.roleLabel}
                {property ? ` · ${property}` : ''}
              </Text>
            </Box>
          </Group>

          <ActionIcon
            variant="subtle"
            size={40}
            radius="xl"
            onClick={logout}
            aria-label="Log out"
            style={{ color: C.inactive, flexShrink: 0 }}
          >
            <LogOut size={20} strokeWidth={1.8} />
          </ActionIcon>
        </Group>
      </Box>

      {/* ─── Page ─── */}
      <Box component="main" px={12} pt={12} style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom) + 12px)' }}>
        {children ?? <Outlet />}
      </Box>

      {/* ─── Bottom bar ─── */}
      <Box
        component="nav"
        aria-label="Main"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          height: 'calc(60px + env(safe-area-inset-bottom))',
          paddingBottom: 'env(safe-area-inset-bottom)',
          background: C.bg,
          borderTop: `1px solid ${C.line}`,
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {cfg.tabs.map((tab) => {
          const active = isActive(tab);
          return (
            <UnstyledButton
              key={tab.to}
              component={Link}
              to={tab.to}
              aria-current={active ? 'page' : undefined}
              style={tabStyle(active)}
            >
              <Box style={{ ...iconSlot, position: 'relative' }}>
                {tab.icon(active)}
                {tab.badge?.()}
              </Box>
              <Text component="span" style={labelStyle(active)}>
                {tab.label}
              </Text>
            </UnstyledButton>
          );
        })}

        {/* More slot (avatar) */}
        <UnstyledButton onClick={open} style={tabStyle(inMore || sheet)}>
          <Box style={iconSlot}>
            <Box
              style={{
                borderRadius: '50%',
                padding: 1,
                border: `2px solid ${inMore || sheet ? C.ink : 'transparent'}`,
                lineHeight: 0,
              }}
            >
              <Avatar
                size={22}
                radius={999}
                styles={{ placeholder: { background: C.avatarBg, color: C.ink, fontSize: 11, fontWeight: 700 } }}
              >
                {initial}
              </Avatar>
            </Box>
          </Box>
          <Text component="span" style={labelStyle(inMore || sheet)}>
            More
          </Text>
        </UnstyledButton>
      </Box>

      {/* ─── More sheet ─── */}
      <Drawer
        opened={sheet}
        onClose={close}
        position="bottom"
        withCloseButton={false}
        radius="lg"
        styles={{
          content: {
            width: '100%',
            height: 'auto',
            maxHeight: '85dvh',
            flex: '0 0 auto',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            paddingBottom: 'env(safe-area-inset-bottom)',
          },
          inner: { alignItems: 'flex-end' },
        }}
      >
        <Box mx="auto" mb="md" style={{ width: 36, height: 4, borderRadius: 2, background: C.line }} />
        <Group gap="sm" mb="md" wrap="nowrap">
          <Avatar size={48} radius={999} styles={{ placeholder: { background: C.avatarBg, color: C.ink, fontWeight: 700 } }}>
            {initial}
          </Avatar>
          <Box style={{ minWidth: 0 }}>
            <Text fw={700} truncate style={{ color: C.ink }}>
              {user?.full_name}
            </Text>
            <Text size="sm" style={{ color: C.muted }}>
              @{user?.username} · {cfg.roleLabel}
              {property ? ` · ${property}` : ''}
            </Text>
          </Box>
        </Group>

        {cfg.more.map((g, gi) => {
          const links = g.links.filter((l) => !l.perm || auth.hasPermission(l.perm));
          if (!links.length) return null;
          return (
            <Box key={gi} mb={g.title ? 'xs' : 0}>
              {g.title && (
                <Text size="xs" fw={700} tt="uppercase" mt="sm" mb={4} style={{ color: C.muted, letterSpacing: 0.4 }}>
                  {g.title}
                </Text>
              )}
              <Stack gap={0} style={{ borderTop: `1px solid ${C.line}` }}>
                {links.map((l) => (
                  <UnstyledButton
                    key={l.to}
                    component={Link}
                    to={l.to}
                    onClick={close}
                    py={13}
                    style={{ borderBottom: `1px solid ${C.line}`, color: C.ink }}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="md" wrap="nowrap">
                        {l.icon}
                        <Text size="md" fw={match(path, l.to) ? 700 : 400}>
                          {l.label}
                        </Text>
                      </Group>
                      <ChevronRight size={18} color={C.muted} />
                    </Group>
                  </UnstyledButton>
                ))}
              </Stack>
            </Box>
          );
        })}
        <UnstyledButton py={14} onClick={logout} style={{ color: C.danger }}>
          <Group gap="md" wrap="nowrap">
            <LogOut size={20} strokeWidth={1.8} />
            <Text size="md" fw={600}>
              Log out
            </Text>
          </Group>
        </UnstyledButton>
      </Drawer>
    </Box>
  );
}

const tabStyle = (active: boolean): CSSProperties => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  color: active ? C.ink : C.inactive,
});

const iconSlot: CSSProperties = {
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const labelStyle = (active: boolean): CSSProperties => ({
  fontSize: 10,
  lineHeight: 1,
  fontWeight: active ? 700 : 500,
  color: active ? C.ink : C.muted,
});
