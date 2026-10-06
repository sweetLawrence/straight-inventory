// import { CSSProperties, ReactNode } from 'react';
// import { ActionIcon, Avatar, Box, Drawer, Group, Stack, Text, UnstyledButton } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
// import {
//   ArrowLeftRight,
//   Banknote,
//   ChevronRight,
//   ClipboardCheck,
//   FileText,
//   House,
//   LogOut,
//   Package,
//   Receipt,
//   SquarePlus,
//   Wallet,
// } from 'lucide-react';
// import { Link, Outlet, useRouterState } from '@tanstack/react-router';
// import { useAuth } from '@/lib/auth/useAuth';

// /**
//  * Instagram-style mobile shell for waiters:
//  * header with logo, name and logout · icon bar with small labels · "More" sheet.
//  */

// const C = {
//   ink: '#111111',
//   inactive: '#262626',
//   muted: '#737373',
//   line: '#DBDBDB',
//   bg: '#FFFFFF',
//   page: '#FAFAFA',
//   danger: '#ED4956',
//   avatarBg: '#EFEFEF',
// };

// interface Tab {
//   label: string;
//   to: string;
//   icon: (active: boolean) => ReactNode;
//   exact?: boolean;
// }

// const stroke = (active: boolean) => (active ? 2.6 : 1.8);

// const TABS: Tab[] = [
//   { label: 'Home', to: '/dashboard', icon: (a) => <House size={24} strokeWidth={stroke(a)} /> },
//   { label: 'Orders', to: '/orders', icon: (a) => <Receipt size={24} strokeWidth={stroke(a)} /> },
//   { label: 'New', to: '/orders/new', exact: true, icon: (a) => <SquarePlus size={26} strokeWidth={stroke(a)} /> },
//   { label: 'Bills', to: '/bills', icon: (a) => <FileText size={24} strokeWidth={stroke(a)} /> },
// ];

// // Shown in the "More" sheet (the 5th slot)
// const MORE_LINKS = [
//   { label: 'Payments', to: '/payments', icon: <Banknote size={20} strokeWidth={1.8} /> },
//   { label: 'Cash drops', to: '/cash-drops', icon: <ArrowLeftRight size={20} strokeWidth={1.8} /> },
//   { label: 'Float', to: '/float', icon: <Wallet size={20} strokeWidth={1.8} /> },
//   { label: 'My handover', to: '/handover', icon: <ClipboardCheck size={20} strokeWidth={1.8} /> },
// ];

// export function AppShellMobile({ children }: { children?: ReactNode }) {
//   const auth = useAuth();
//   const [sheet, { open, close }] = useDisclosure(false);
//   const path = useRouterState({ select: (s) => s.location.pathname });

//   const isActive = (tab: Tab) => {
//     if (tab.exact) return path === tab.to;
//     // /orders/new belongs to the centre button, not to Orders
//     if (tab.to === '/orders' && path === '/orders/new') return false;
//     return path === tab.to || path.startsWith(tab.to + '/');
//   };
//   const inMore = MORE_LINKS.some((l) => path === l.to || path.startsWith(l.to + '/'));

//   const user = auth.user;
//   const initial = user?.full_name?.[0]?.toUpperCase() ?? '?';
//   const property = user?.roles[0]?.property_code;

//   const logout = () => {
//     auth.logout();
//     window.location.replace('/login');
//   };

//   return (
//     <Box style={{ minHeight: '100dvh', background: C.page }}>
//       {/* ─── Header: logo · name · logout ─── */}
//       <Box
//         component="header"
//         style={{
//           position: 'sticky',
//           top: 0,
//           zIndex: 100,
//           paddingTop: 'env(safe-area-inset-top)',
//           background: C.bg,
//           borderBottom: `1px solid ${C.line}`,
//         }}
//       >
//         <Group h={56} px={12} justify="space-between" wrap="nowrap" gap="sm">
//           <Group gap={10} wrap="nowrap" style={{ minWidth: 0 }}>
//             <Box
//               aria-label="Straight Inventory"
//               style={{
//                 width: 34,
//                 height: 34,
//                 flexShrink: 0,
//                 borderRadius: 10,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 color: '#FFFFFF',
//                 background: 'linear-gradient(135deg, #228BE6 0%, #15AABF 100%)',
//               }}
//             >
//               <Package size={18} />
//             </Box>
//             <Box style={{ minWidth: 0 }}>
//               <Text fw={700} size="sm" lh={1.2} truncate style={{ color: C.ink }}>
//                 {user?.full_name}
//               </Text>
//               <Text size="xs" lh={1.2} truncate style={{ color: C.muted }}>
//                 Waiter{property ? ` · ${property}` : ''}
//               </Text>
//             </Box>
//           </Group>

//           <ActionIcon
//             variant="subtle"
//             size={40}
//             radius="xl"
//             onClick={logout}
//             aria-label="Log out"
//             style={{ color: C.inactive, flexShrink: 0 }}
//           >
//             <LogOut size={20} strokeWidth={1.8} />
//           </ActionIcon>
//         </Group>
//       </Box>

//       {/* ─── Page ─── */}
//       <Box
//         component="main"
//         px={12}
//         pt={12}
//         style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom) + 12px)' }}
//       >
//         {children ?? <Outlet />}
//       </Box>

//       {/* ─── Bottom bar ─── */}
//       <Box
//         component="nav"
//         aria-label="Main"
//         style={{
//           position: 'fixed',
//           left: 0,
//           right: 0,
//           bottom: 0,
//           zIndex: 100,
//           height: 'calc(60px + env(safe-area-inset-bottom))',
//           paddingBottom: 'env(safe-area-inset-bottom)',
//           background: C.bg,
//           borderTop: `1px solid ${C.line}`,
//           display: 'flex',
//           alignItems: 'stretch',
//         }}
//       >
//         {TABS.map((tab) => {
//           const active = isActive(tab);
//           return (
//             <UnstyledButton
//               key={tab.to}
//               component={Link}
//               to={tab.to}
//               aria-current={active ? 'page' : undefined}
//               style={tabStyle(active)}
//             >
//               <Box style={iconSlot}>{tab.icon(active)}</Box>
//               <Text component="span" style={labelStyle(active)}>
//                 {tab.label}
//               </Text>
//             </UnstyledButton>
//           );
//         })}

//         {/* More slot (avatar) */}
//         <UnstyledButton onClick={open} style={tabStyle(inMore || sheet)}>
//           <Box style={iconSlot}>
//           <Box
//             style={{
//               borderRadius: '50%',
//               padding: 1,
//               border: `2px solid ${inMore || sheet ? C.ink : 'transparent'}`,
//               lineHeight: 0,
//             }}
//           >
//             <Avatar
//               size={22}
//               radius={999}
//               styles={{ placeholder: { background: C.avatarBg, color: C.ink, fontSize: 11, fontWeight: 700 } }}
//             >
//               {initial}
//             </Avatar>
//           </Box>
//           </Box>
//           <Text component="span" style={labelStyle(inMore || sheet)}>
//             More
//           </Text>
//         </UnstyledButton>
//       </Box>

//       {/* ─── More sheet ─── */}
//       <Drawer
//         opened={sheet}
//         onClose={close}
//         position="bottom"
//         withCloseButton={false}
//         radius="lg"
//         styles={{
//           content: {
//             width: '100%',
//             height: 'auto',
//             maxHeight: '85dvh',
//             flex: '0 0 auto',
//             borderBottomLeftRadius: 0,
//             borderBottomRightRadius: 0,
//             paddingBottom: 'env(safe-area-inset-bottom)',
//           },
//           inner: { alignItems: 'flex-end' },
//         }}
//       >
//         <Box mx="auto" mb="md" style={{ width: 36, height: 4, borderRadius: 2, background: C.line }} />
//         <Group gap="sm" mb="md" wrap="nowrap">
//           <Avatar
//             size={48}
//             radius={999}
//             styles={{ placeholder: { background: C.avatarBg, color: C.ink, fontWeight: 700 } }}
//           >
//             {initial}
//           </Avatar>
//           <Box style={{ minWidth: 0 }}>
//             <Text fw={700} truncate style={{ color: C.ink }}>{user?.full_name}</Text>
//             <Text size="sm" style={{ color: C.muted }}>
//               @{user?.username}
//               {property ? ` · ${property}` : ''}
//             </Text>
//           </Box>
//         </Group>

//         <Stack gap={0} style={{ borderTop: `1px solid ${C.line}` }}>
//           {MORE_LINKS.map((l) => (
//             <UnstyledButton
//               key={l.to}
//               component={Link}
//               to={l.to}
//               onClick={close}
//               py={14}
//               style={{ borderBottom: `1px solid ${C.line}`, color: C.ink }}
//             >
//               <Group justify="space-between" wrap="nowrap">
//                 <Group gap="md" wrap="nowrap">
//                   {l.icon}
//                   <Text size="md">{l.label}</Text>
//                 </Group>
//                 <ChevronRight size={18} color={C.muted} />
//               </Group>
//             </UnstyledButton>
//           ))}
//           <UnstyledButton py={14} onClick={logout} style={{ color: C.danger }}>
//             <Group gap="md" wrap="nowrap">
//               <LogOut size={20} strokeWidth={1.8} />
//               <Text size="md" fw={600}>Log out</Text>
//             </Group>
//           </UnstyledButton>
//         </Stack>
//       </Drawer>
//     </Box>
//   );
// }

// const tabStyle = (active: boolean): CSSProperties => ({
//   flex: 1,
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
//   gap: 3,
//   color: active ? C.ink : C.inactive,
// });

// const iconSlot: CSSProperties = {
//   height: 28,
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// };

// const labelStyle = (active: boolean): CSSProperties => ({
//   fontSize: 10,
//   lineHeight: 1,
//   fontWeight: active ? 700 : 500,
//   color: active ? C.ink : C.muted,
// });





























import { CSSProperties, ReactNode, useEffect } from 'react';
import { ActionIcon, Avatar, Box, Drawer, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ArrowLeftRight,
  Banknote,
  ChevronRight,
  ClipboardCheck,
  FileText,
  House,
  LogOut,
  Package,
  Receipt,
  SquarePlus,
  Wallet,
} from 'lucide-react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth/useAuth';

/**
 * Instagram-style mobile shell for waiters:
 * header with logo, name and logout · icon bar with small labels · "More" sheet.
 */

const C = {
  ink: '#111111',
  inactive: '#262626',
  muted: '#737373',
  line: '#DBDBDB',
  bg: '#FFFFFF',
  page: '#FAFAFA',
  danger: '#ED4956',
  avatarBg: '#EFEFEF',
};

interface Tab {
  label: string;
  to: string;
  icon: (active: boolean) => ReactNode;
  exact?: boolean;
}

const stroke = (active: boolean) => (active ? 2.6 : 1.8);

const TABS: Tab[] = [
  { label: 'Home', to: '/dashboard', icon: (a) => <House size={24} strokeWidth={stroke(a)} /> },
  { label: 'Orders', to: '/orders', icon: (a) => <Receipt size={24} strokeWidth={stroke(a)} /> },
  { label: 'New', to: '/orders/new', exact: true, icon: (a) => <SquarePlus size={26} strokeWidth={stroke(a)} /> },
  { label: 'Bills', to: '/bills', icon: (a) => <FileText size={24} strokeWidth={stroke(a)} /> },
];

// Shown in the "More" sheet (the 5th slot)
const MORE_LINKS = [
  { label: 'Payments', to: '/payments', icon: <Banknote size={20} strokeWidth={1.8} /> },
  { label: 'Cash drops', to: '/cash-drops', icon: <ArrowLeftRight size={20} strokeWidth={1.8} /> },
  { label: 'Float', to: '/float', icon: <Wallet size={20} strokeWidth={1.8} /> },
  { label: 'My handover', to: '/handover', icon: <ClipboardCheck size={20} strokeWidth={1.8} /> },
];

export function AppShellMobile({ children }: { children?: ReactNode }) {
  const auth = useAuth();
  const [sheet, { open, close }] = useDisclosure(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

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

  const isActive = (tab: Tab) => {
    if (tab.exact) return path === tab.to;
    // /orders/new belongs to the centre button, not to Orders
    if (tab.to === '/orders' && path === '/orders/new') return false;
    return path === tab.to || path.startsWith(tab.to + '/');
  };
  const inMore = MORE_LINKS.some((l) => path === l.to || path.startsWith(l.to + '/'));

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
                Waiter{property ? ` · ${property}` : ''}
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
      <Box
        component="main"
        px={12}
        pt={12}
        style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom) + 12px)' }}
      >
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
        {TABS.map((tab) => {
          const active = isActive(tab);
          return (
            <UnstyledButton
              key={tab.to}
              component={Link}
              to={tab.to}
              aria-current={active ? 'page' : undefined}
              style={tabStyle(active)}
            >
              <Box style={iconSlot}>{tab.icon(active)}</Box>
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
          <Avatar
            size={48}
            radius={999}
            styles={{ placeholder: { background: C.avatarBg, color: C.ink, fontWeight: 700 } }}
          >
            {initial}
          </Avatar>
          <Box style={{ minWidth: 0 }}>
            <Text fw={700} truncate style={{ color: C.ink }}>{user?.full_name}</Text>
            <Text size="sm" style={{ color: C.muted }}>
              @{user?.username}
              {property ? ` · ${property}` : ''}
            </Text>
          </Box>
        </Group>

        <Stack gap={0} style={{ borderTop: `1px solid ${C.line}` }}>
          {MORE_LINKS.map((l) => (
            <UnstyledButton
              key={l.to}
              component={Link}
              to={l.to}
              onClick={close}
              py={14}
              style={{ borderBottom: `1px solid ${C.line}`, color: C.ink }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group gap="md" wrap="nowrap">
                  {l.icon}
                  <Text size="md">{l.label}</Text>
                </Group>
                <ChevronRight size={18} color={C.muted} />
              </Group>
            </UnstyledButton>
          ))}
          <UnstyledButton py={14} onClick={logout} style={{ color: C.danger }}>
            <Group gap="md" wrap="nowrap">
              <LogOut size={20} strokeWidth={1.8} />
              <Text size="md" fw={600}>Log out</Text>
            </Group>
          </UnstyledButton>
        </Stack>
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