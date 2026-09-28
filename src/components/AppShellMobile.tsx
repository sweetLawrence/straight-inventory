import { ReactNode } from 'react';
import {
  AppShell as MantineAppShell,
  Avatar,
  Box,
  Group,
  Menu,
  Text,
  ThemeIcon,
  UnstyledButton,
  Badge,
} from '@mantine/core';
import {
  Receipt,
  FileText,
  Banknote,
  UtensilsCrossed,
  User,
  LogOut,
  Package,
} from 'lucide-react';
import {
  Link,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { useAuth } from '@/lib/auth/useAuth';

// ─── Tab config ────────────────────────────────────────────────────

interface MobileTab {
  label: string;
  to: string;
  icon: ReactNode;
}

const tabs: MobileTab[] = [
  { label: 'Orders', to: '/orders', icon: <Receipt size={22} strokeWidth={2} /> },
  { label: 'Bills', to: '/bills', icon: <FileText size={22} strokeWidth={2} /> },
  { label: 'Payments', to: '/payments', icon: <Banknote size={22} strokeWidth={2} /> },
  { label: 'Menu', to: '/menu', icon: <UtensilsCrossed size={22} strokeWidth={2} /> },
];

// ─── Component ─────────────────────────────────────────────────────

export function AppShellMobile({ children }: { children?: ReactNode }) {
  const auth = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (to: string) =>
    currentPath === to || currentPath.startsWith(to + '/');

  const initial = auth.user?.full_name?.[0] ?? '?';
  const role = auth.user?.roles[0]?.code;

  return (
    <MantineAppShell
      header={{ height: 56 }}
      padding={0}
      styles={{
        main: {
          background: 'var(--mantine-color-gray-0)',
          // space above the fixed tab bar
          paddingBottom: 'calc(72px + env(safe-area-inset-bottom))',
        },
      }}
    >
      {/* ─── Compact header ─── */}
      <MantineAppShell.Header
        style={{
          background: 'white',
          borderBottom: '1px solid var(--mantine-color-gray-2)',
        }}
      >
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap={8} wrap="nowrap">
            <ThemeIcon
              size={28}
              radius="md"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
            >
              <Package size={16} />
            </ThemeIcon>
            <Text fw={700} size="sm">
              Straight
            </Text>
          </Group>

          {/* User menu */}
          <Menu shadow="md" width={200} position="bottom-end" radius="md">
            <Menu.Target>
              <UnstyledButton>
                <Group gap="xs">
                  <Avatar size={32} radius="xl" color="blue">
                    {initial}
                  </Avatar>
                  {role && (
                    <Badge
                      size="xs"
                      variant="light"
                      radius="sm"
                      visibleFrom="xs"
                    >
                      {role}
                    </Badge>
                  )}
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>
                <Text size="xs" fw={600}>
                  {auth.user?.full_name}
                </Text>
                <Text size="xs" c="dimmed">
                  @{auth.user?.username}
                </Text>
              </Menu.Label>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<LogOut size={14} />}
                onClick={() => {
                  auth.logout();
                  window.location.replace('/login');
                }}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </MantineAppShell.Header>

      {/* ─── Main content ─── */}
      <MantineAppShell.Main>{children ?? <Outlet />}</MantineAppShell.Main>

      {/* ─── Bottom tab bar ─── */}
      <Box
        component="nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'calc(64px + env(safe-area-inset-bottom))',
          paddingBottom: 'env(safe-area-inset-bottom)',
          background: 'white',
          borderTop: '1px solid var(--mantine-color-gray-2)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {tabs.map((tab) => {
          const active = isActive(tab.to);
          return (
            <UnstyledButton
              key={tab.to}
              component={Link}
              to={tab.to}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                color: active
                  ? 'var(--mantine-color-blue-6)'
                  : 'var(--mantine-color-gray-6)',
                transition: 'color 120ms ease',
              }}
            >
              <Box
                style={{
                  transition: 'transform 120ms ease',
                  transform: active ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {tab.icon}
              </Box>
              <Text
                size="xs"
                fw={active ? 600 : 500}
                style={{ lineHeight: 1 }}
              >
                {tab.label}
              </Text>
            </UnstyledButton>
          );
        })}
      </Box>
    </MantineAppShell>
  );
}