// import { ReactNode } from 'react'
// import {
//   AppShell as MantineAppShell,
//   Burger,
//   Group,
//   NavLink,
//   Text,
//   Avatar,
//   Menu,
//   UnstyledButton,
//   Loader,
//   Center,
//   Box,
//   Stack,
//   ThemeIcon,
//   ScrollArea
// } from '@mantine/core'
// import { useDisclosure } from '@mantine/hooks'
// import {
//   LayoutDashboard,
//   Package,
//   Banknote,
//   Receipt,
//   ArrowLeftRight,
//   Wrench,
//   Users,
//   BarChart3,
//   LogOut,
//   ChevronDown,
//   Building2,
//   Menu as MenuIcon,
//   FileText,
//   ChevronRight,
//   Layers,
//   Wine,
//   CheckCircle2
// } from 'lucide-react'
// import {
//   Link,
//   Outlet,
//   useNavigate,
//   useRouterState
// } from '@tanstack/react-router'
// import { useAuth } from '@/lib/auth/useAuth'

// interface NavLeaf {
//   type: 'leaf'
//   label: string
//   to: string
//   icon?: ReactNode
//   roles?: string[]
// }

// interface NavGroup {
//   type: 'group'
//   label: string
//   icon: ReactNode
//   roles?: string[]
//   children: NavLeaf[]
// }

// type NavEntry = NavLeaf | NavGroup

// const navSections: { title: string; items: NavEntry[] }[] = [
//   {
//     title: 'Overview',
//     items: [
//       {
//         type: 'leaf',
//         label: 'Dashboard',
//         to: '/dashboard',
//         icon: <LayoutDashboard size={18} />
//       }
//     ]
//   },
//   {
//     title: 'Bar',
//     items: [
//       {
//         type: 'leaf',
//         label: 'Bar Dashboard',
//         to: '/bar',
//         icon: <Wine size={18} />,
//         roles: ['bar_attendant', 'manager', 'md']
//       },
//       {
//         type: 'leaf',
//         label: 'Bar Stock',
//         to: '/bar/stock',
//         icon: <Package size={18} />,
//         roles: ['bar_attendant', 'manager', 'md']
//       },
//       {
//         type: 'leaf',
//         label: 'Bar Orders',
//         to: '/bar/orders',
//         icon: <Receipt size={18} />,
//         roles: ['bar_attendant']
//       },
//       {
//         type: 'leaf',
//         label: 'Bar Handover',
//         to: '/bar/handover',
//         icon: <Banknote size={18} />,
//         roles: ['bar_attendant']
//       },
//       {
//         type: 'leaf',
//         label: 'Bar Reports',
//         to: '/bar/reports',
//         icon: <BarChart3 size={18} />,
//         roles: ['bar_attendant']
//       }
//     ]
//   },
//   {
//     title: 'Sales',
//     items: [
//       {
//         type: 'leaf',
//         label: 'Orders',
//         to: '/orders',
//         icon: <Receipt size={18} />,
//         roles: ['waiter', 'supervisor', 'manager', 'bar_attendant']
//       },
//       {
//         type: 'leaf',
//         label: 'Bills',
//         to: '/bills',
//         icon: <FileText size={18} />,
//         roles: ['waiter', 'supervisor', 'manager', 'bar_attendant']
//       },
//       {
//         type: 'group',
//         label: 'Payments',
//         icon: <Banknote size={18} />,
//         roles: ['cashier', 'supervisor', 'manager', 'waiter', 'bar_attendant'],
//         children: [
//           { type: 'leaf', label: 'All Payments', to: '/payments' },
//           {
//             type: 'leaf',
//             label: 'Pending Verification',
//             to: '/payments/pending'
//           },
//           { type: 'leaf', label: 'Cash Drops', to: '/cash-drops' },
//           { type: 'leaf', label: 'Float', to: '/float' },
//           { type: 'leaf', label: 'My Handover', to: '/handover' }
//         ]
//       }
//     ]
//   },

//   {
//     title: 'Store',
//     items: [
//       {
//         type: 'leaf',
//         label: 'Dispatch Queue',
//         to: '/store/queue',
//         icon: <Package size={18} />,
//         roles: ['store_manager', 'manager', 'md', 'admin']
//       },
//       {
//         type: 'leaf',
//         label: 'Issue Slips',
//         to: '/store/slips',
//         icon: <FileText size={18} />,
//         roles: ['store_manager', 'manager', 'md', 'admin']
//       }
//     ]
//   },

//   {
//     title: 'Operations',
//     items: [
//       {
//         type: 'group',
//         label: 'Stock',
//         icon: <Package size={18} />,
//         roles: ['store_manager', 'bar_attendant', 'supervisor', 'manager'],
//         children: [
//           { type: 'leaf', label: 'Batches', to: '/stock/batches' },
//           {
//             type: 'leaf',
//             label: 'Portion Inventory',
//             to: '/stock/portion-inventory'
//           },
//           { type: 'leaf', label: 'Ledger', to: '/stock/ledger' },
//           { type: 'leaf', label: 'Balance', to: '/stock/balance' },
//           { type: 'leaf', label: 'Bulk Issues', to: '/stock/bulk-issues' },
//           { type: 'leaf', label: 'Stock Items', to: '/stock/items' }
//         ]
//       },
//       {
//         type: 'leaf',
//         label: 'Bar Approvals',
//         to: '/bar-approvals',
//         icon: <CheckCircle2 size={18} />,
//         roles: ['manager', 'admin']
//       },
//       {
//         type: 'group',
//         label: 'Transfers',
//         icon: <ArrowLeftRight size={18} />,
//         roles: ['store_manager', 'supervisor', 'manager', 'md'],
//         children: [{ type: 'leaf', label: 'All Transfers', to: '/transfers' }]
//       },
//       {
//         type: 'group',
//         label: 'Production',
//         icon: <Wrench size={18} />,
//         roles: ['store_manager', 'manager'],
//         children: [
//           { type: 'leaf', label: 'Batches', to: '/production' },
//           { type: 'leaf', label: 'Variances', to: '/production/variances' },
//           { type: 'leaf', label: 'Thresholds', to: '/variance-thresholds' }
//         ]
//       },
//       {
//         type: 'group',
//         label: 'Staff Meals',
//         icon: <Users size={18} />,
//         roles: ['store_manager', 'supervisor', 'manager'],
//         children: [
//           { type: 'leaf', label: 'All Meals', to: '/staff-meals' },
//           { type: 'leaf', label: 'Daily View', to: '/staff-meals/daily' }
//         ]
//       },
//       {
//         type: 'group',
//         label: 'Operations',
//         icon: <Layers size={18} />,
//         roles: ['store_manager', 'supervisor', 'manager'],
//         children: [
//           { type: 'leaf', label: 'Waste', to: '/waste' },
//           { type: 'leaf', label: 'Returns', to: '/returns' },
//           { type: 'leaf', label: 'Disputes', to: '/disputes' }
//         ]
//       }
//     ]
//   },
//   {
//     title: 'Management',
//     items: [
//       // {
//       //   type: 'group',
//       //   label: 'Menu',
//       //   icon: <MenuIcon size={18} />,
//       //   roles: ['manager', 'md', 'admin', 'supervisor'],
//       //   children: [
//       //     { type: 'leaf', label: 'Menu Items', to: '/menu' },
//       //     {
//       //       type: 'leaf',
//       //       label: 'Portion Definitions',
//       //       to: '/portion-definitions',
//       //     },
//       //     { type: 'leaf', label: 'Recipes', to: '/recipes' },
//       //     { type: 'leaf', label: 'Staff Menu', to: '/staff-menu' },
//       //   ],
//       // },

//       {
//         type: 'group',
//         label: 'Menu',
//         icon: <MenuIcon size={18} />,
//         roles: ['manager', 'md', 'admin', 'supervisor', 'store_manager'],
//         children: [
//           { type: 'leaf', label: 'Master Items', to: '/menu/master-items' },
//           { type: 'leaf', label: 'Menu Items', to: '/menu' },
//           {
//             type: 'leaf',
//             label: 'Portion Definitions',
//             to: '/portion-definitions'
//           },
//           { type: 'leaf', label: 'Recipes', to: '/recipes' },
//           { type: 'leaf', label: 'Staff Menu', to: '/staff-menu' }
//         ]
//       },
//       {
//         type: 'leaf',
//         label: 'Properties',
//         to: '/properties',
//         icon: <Building2 size={18} />,
//         roles: ['manager', 'md', 'admin']
//       },
//       {
//         type: 'leaf',
//         label: 'Users',
//         to: '/users',
//         icon: <Users size={18} />,
//         roles: ['manager', 'md', 'admin']
//       },
//       {
//         type: 'leaf',
//         label: 'Reports',
//         to: '/reports',
//         icon: <BarChart3 size={18} />,
//         roles: ['manager', 'md']
//       },
//       {
//         type: 'group',
//         label: 'System',
//         icon: <BarChart3 size={18} />,
//         roles: ['manager', 'md', 'admin'],
//         children: [
//           { type: 'leaf', label: 'Adjustments', to: '/adjustments' },
//           { type: 'leaf', label: 'Reconciliation', to: '/reconciliation' },
//           { type: 'leaf', label: 'Exceptions', to: '/exceptions' },
//           { type: 'leaf', label: 'Audit Log', to: '/audit' }
//         ]
//       }
//     ]
//   }
// ]

// export function AppShell ({ children }: { children?: ReactNode }) {
//   const [opened, { toggle }] = useDisclosure()
//   const auth = useAuth()
//   const navigate = useNavigate()
//   const routerState = useRouterState()
//   const currentPath = routerState.location.pathname

//   if (!auth.isReady || !auth.user) {
//     return (
//       <Center h='100vh'>
//         <Loader />
//       </Center>
//     )
//   }

//   const canSee = (roles?: string[]) => {
//     if (!roles) return true
//     return roles.some(r => auth.hasRole(r))
//   }

//   const allLeafPaths = navSections.flatMap(section =>
//     section.items.flatMap(item =>
//       item.type === 'leaf' ? [item.to] : item.children.map(c => c.to)
//     )
//   )

//   const activePath = allLeafPaths
//     .filter(path => currentPath === path || currentPath.startsWith(path + '/'))
//     .sort((a, b) => b.length - a.length)[0]

//   const initial = auth.user.full_name?.[0] ?? '?'
//   const primaryRole = auth.user.roles[0]?.code

//   return (
//     <MantineAppShell
//       header={{ height: 60 }}
//       navbar={{
//         width: 260,
//         breakpoint: 'sm',
//         collapsed: { mobile: !opened }
//       }}
//       padding='md'
//     >
//       <MantineAppShell.Header
//         style={{
//           borderBottom: '1px solid var(--mantine-color-gray-2)',
//           background: 'white'
//         }}
//       >
//         <Group h='100%' px='md' justify='space-between'>
//           <Group gap='sm'>
//             <Burger
//               opened={opened}
//               onClick={toggle}
//               hiddenFrom='sm'
//               size='sm'
//             />
//             <Group gap={10}>
//               <ThemeIcon
//                 size={32}
//                 radius='md'
//                 variant='gradient'
//                 gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
//               >
//                 <Package size={18} />
//               </ThemeIcon>
//               <Text fw={700} size='md' style={{ letterSpacing: '-0.01em' }}>
//                 Straight Inventory
//               </Text>
//             </Group>
//           </Group>

//           <Menu shadow='md' width={220} position='bottom-end' radius='md'>
//             <Menu.Target>
//               <UnstyledButton
//                 style={{
//                   padding: '6px 10px',
//                   borderRadius: 10,
//                   transition: 'background 120ms ease'
//                 }}
//               >
//                 <Group gap='xs'>
//                   <Avatar size={30} radius='xl' color='blue'>
//                     {initial}
//                   </Avatar>
//                   <Box visibleFrom='sm'>
//                     <Text size='sm' fw={600} lh={1.1}>
//                       {auth.user.full_name}
//                     </Text>
//                     {primaryRole && (
//                       <Text size='xs' c='dimmed' lh={1.2}>
//                         {primaryRole}
//                       </Text>
//                     )}
//                   </Box>
//                   <ChevronDown size={14} opacity={0.5} />
//                 </Group>
//               </UnstyledButton>
//             </Menu.Target>
//             <Menu.Dropdown>
//               <Menu.Label>{auth.user.username}</Menu.Label>
//               <Menu.Divider />
//               <Menu.Item
//                 color='red'
//                 leftSection={<LogOut size={14} />}
//                 onClick={() => {
//                   auth.logout()
//                   window.location.replace('/login')
//                 }}
//               >
//                 Logout
//               </Menu.Item>
//             </Menu.Dropdown>
//           </Menu>
//         </Group>
//       </MantineAppShell.Header>

//       <MantineAppShell.Navbar
//         p={0}
//         style={{
//           background: '#0f172a',
//           borderRight: '1px solid #1e293b'
//         }}
//       >
//         <ScrollArea style={{ flex: 1 }} scrollbarSize={6} type='hover'>
//           <Stack gap={0} p='sm'>
//             {navSections.map((section, sIdx) => {
//               const visibleItems = section.items.filter(item =>
//                 canSee(item.roles)
//               )
//               if (visibleItems.length === 0) return null

//               return (
//                 <Box
//                   key={section.title}
//                   mb={sIdx === navSections.length - 1 ? 0 : 4}
//                 >
//                   <Text
//                     size='xs'
//                     fw={600}
//                     tt='uppercase'
//                     px='sm'
//                     pt={sIdx === 0 ? 4 : 16}
//                     pb={6}
//                     style={{
//                       letterSpacing: 1,
//                       color: 'rgba(255,255,255,0.4)'
//                     }}
//                   >
//                     {section.title}
//                   </Text>

//                   <Stack gap={2}>
//                     {visibleItems.map(item => {
//                       if (item.type === 'leaf') {
//                         const active = activePath === item.to
//                         return (
//                           <NavLink
//                             key={item.to}
//                             component={Link}
//                             to={item.to}
//                             label={item.label}
//                             leftSection={item.icon}
//                             active={active}
//                             onClick={() => opened && toggle()}
//                             styles={navLinkStyles(active)}
//                           />
//                         )
//                       }

//                       const childVisible = item.children.filter(c =>
//                         canSee(c.roles)
//                       )
//                       if (childVisible.length === 0) return null

//                       const groupActive = childVisible.some(
//                         c => activePath === c.to
//                       )

//                       return (
//                         <NavLink
//                           key={item.label}
//                           label={item.label}
//                           leftSection={item.icon}
//                           defaultOpened={groupActive}
//                           active={groupActive}
//                           styles={navLinkStyles(groupActive)}
//                           rightSection={
//                             <ChevronRight
//                               size={14}
//                               style={{
//                                 transition: 'transform 150ms ease',
//                                 opacity: 0.5
//                               }}
//                             />
//                           }
//                         >
//                           {childVisible.map(child => {
//                             const active = activePath === child.to
//                             return (
//                               <NavLink
//                                 key={child.to}
//                                 component={Link}
//                                 to={child.to}
//                                 label={child.label}
//                                 active={active}
//                                 onClick={() => opened && toggle()}
//                                 styles={subNavLinkStyles(active)}
//                               />
//                             )
//                           })}
//                         </NavLink>
//                       )
//                     })}
//                   </Stack>
//                 </Box>
//               )
//             })}
//           </Stack>
//         </ScrollArea>

//         <Box
//           p='sm'
//           style={{
//             borderTop: '1px solid rgba(255,255,255,0.08)',
//             background: 'rgba(0,0,0,0.2)'
//           }}
//         >
//           <Group gap='xs' wrap='nowrap'>
//             <Avatar size={32} radius='xl' color='blue'>
//               {initial}
//             </Avatar>
//             <Box style={{ flex: 1, minWidth: 0 }}>
//               <Text size='xs' fw={600} c='white' truncate>
//                 {auth.user.full_name}
//               </Text>
//               <Text
//                 size='xs'
//                 truncate
//                 style={{ color: 'rgba(255,255,255,0.5)' }}
//               >
//                 @{auth.user.username}
//               </Text>
//             </Box>
//             <UnstyledButton
//               onClick={() => {
//                 auth.logout()
//                 window.location.replace('/login')
//               }}
//               style={{
//                 padding: 6,
//                 borderRadius: 8,
//                 color: 'rgba(255,255,255,0.6)'
//               }}
//               title='Logout'
//             >
//               <LogOut size={16} />
//             </UnstyledButton>
//           </Group>
//         </Box>
//       </MantineAppShell.Navbar>

//       <MantineAppShell.Main
//         style={{ background: 'var(--mantine-color-gray-0)' }}
//       >
//         {children ?? <Outlet />}
//       </MantineAppShell.Main>
//     </MantineAppShell>
//   )
// }

// function navLinkStyles (active: boolean) {
//   return {
//     root: {
//       borderRadius: 8,
//       padding: '8px 12px',
//       color: active ? 'white' : 'rgba(255,255,255,0.72)',
//       background: active ? 'rgba(59,130,246,0.18)' : 'transparent',
//       fontWeight: active ? 600 : 500,
//       transition: 'background 120ms ease, color 120ms ease',
//       '&:hover': {
//         background: active ? 'rgba(59,130,246,0.22)' : 'rgba(255,255,255,0.06)',
//         color: 'white'
//       },
//       '&[data-active]': {
//         background: 'rgba(59,130,246,0.18)',
//         color: 'white'
//       }
//     },
//     label: { fontSize: 13.5 },
//     section: {
//       color: active ? 'var(--mantine-color-blue-4)' : 'inherit'
//     }
//   } as const
// }

// function subNavLinkStyles (active: boolean) {
//   return {
//     root: {
//       borderRadius: 6,
//       padding: '6px 12px 6px 40px',
//       color: active ? 'white' : 'rgba(255,255,255,0.6)',
//       background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
//       fontWeight: active ? 600 : 400,
//       transition: 'background 120ms ease, color 120ms ease',
//       '&:hover': {
//         background: 'rgba(255,255,255,0.06)',
//         color: 'white'
//       },
//       '&[data-active]': {
//         background: 'rgba(59,130,246,0.15)',
//         color: 'white'
//       }
//     },
//     label: { fontSize: 13 }
//   } as const
// }


























import { ReactNode } from 'react'
import {
  AppShell as MantineAppShell,
  Burger,
  Group,
  NavLink,
  Text,
  Avatar,
  Menu,
  UnstyledButton,
  Loader,
  Center,
  Box,
  Stack,
  ThemeIcon,
  ScrollArea
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  LayoutDashboard,
  Package,
  Banknote,
  Receipt,
  ArrowLeftRight,
  Wrench,
  Users,
  BarChart3,
  LogOut,
  ChevronDown,
  Building2,
  Menu as MenuIcon,
  FileText,
  ChevronRight,
  Layers,
  Wine,
  CheckCircle2
} from 'lucide-react'
import {
  Link,
  Outlet,
  useNavigate,
  useRouterState
} from '@tanstack/react-router'
import { useAuth } from '@/lib/auth/useAuth'

interface NavLeaf {
  type: 'leaf'
  label: string
  to: string
  icon?: ReactNode
  roles?: string[]
}

interface NavGroup {
  type: 'group'
  label: string
  icon: ReactNode
  roles?: string[]
  children: NavLeaf[]
}

type NavEntry = NavLeaf | NavGroup

const navSections: { title: string; items: NavEntry[] }[] = [
  {
    title: 'Overview',
    items: [
      {
        type: 'leaf',
        label: 'Dashboard',
        to: '/dashboard',
        icon: <LayoutDashboard size={18} />
      }
    ]
  },
  {
    title: 'Bar',
    items: [
      {
        type: 'leaf',
        label: 'Bar Dashboard',
        to: '/bar',
        icon: <Wine size={18} />,
        roles: ['bar_attendant', 'manager', 'md']
      },
      {
        type: 'leaf',
        label: 'Bar Stock',
        to: '/bar/stock',
        icon: <Package size={18} />,
        roles: ['bar_attendant', 'manager', 'md']
      },
      {
        type: 'leaf',
        label: 'Bar Orders',
        to: '/bar/orders',
        icon: <Receipt size={18} />,
        roles: ['bar_attendant']
      },
      {
        type: 'leaf',
        label: 'Bar Handover',
        to: '/bar/handover',
        icon: <Banknote size={18} />,
        roles: ['bar_attendant']
      },
      {
        type: 'leaf',
        label: 'Bar Reports',
        to: '/bar/reports',
        icon: <BarChart3 size={18} />,
        roles: ['bar_attendant']
      }
    ]
  },
  {
    title: 'Sales',
    items: [
      {
        type: 'leaf',
        label: 'Orders',
        to: '/orders',
        icon: <Receipt size={18} />,
        roles: ['waiter', 'supervisor', 'manager', 'bar_attendant']
      },
      {
        type: 'leaf',
        label: 'Bills',
        to: '/bills',
        icon: <FileText size={18} />,
        roles: ['waiter', 'supervisor', 'manager', 'bar_attendant']
      },
      {
        type: 'group',
        label: 'Payments',
        icon: <Banknote size={18} />,
        roles: ['cashier', 'supervisor', 'manager', 'waiter', 'bar_attendant'],
        children: [
          { type: 'leaf', label: 'All Payments', to: '/payments' },
          {
            type: 'leaf',
            label: 'Pending Verification',
            to: '/payments/pending'
          },
          { type: 'leaf', label: 'Cash Drops', to: '/cash-drops' },
          { type: 'leaf', label: 'Float', to: '/float' },
          { type: 'leaf', label: 'My Handover', to: '/handover' }
        ]
      }
    ]
  },

  {
    title: 'Store',
    items: [
      {
        type: 'leaf',
        label: 'Dispatch Queue',
        to: '/store/queue',
        icon: <Package size={18} />,
        roles: ['store_manager', 'manager', 'md', 'admin']
      },
      {
        type: 'leaf',
        label: 'Issue Slips',
        to: '/store/slips',
        icon: <FileText size={18} />,
        roles: ['store_manager', 'manager', 'md', 'admin']
      }
    ]
  },

  {
    title: 'Operations',
    items: [
      {
        type: 'group',
        label: 'Stock',
        icon: <Package size={18} />,
        roles: ['store_manager', 'bar_attendant', 'supervisor', 'manager'],
        children: [
          { type: 'leaf', label: 'Batches', to: '/stock/batches' },
          {
            type: 'leaf',
            label: 'Portion Inventory',
            to: '/stock/portion-inventory'
          },
          { type: 'leaf', label: 'Ledger', to: '/stock/ledger' },
          { type: 'leaf', label: 'Balance', to: '/stock/balance' },
          { type: 'leaf', label: 'Bulk Issues', to: '/stock/bulk-issues' },
          { type: 'leaf', label: 'Stock Items', to: '/stock/items' }
        ]
      },
      {
        type: 'leaf',
        label: 'Bar Approvals',
        to: '/bar-approvals',
        icon: <CheckCircle2 size={18} />,
        roles: ['manager', 'admin']
      },
      {
        type: 'group',
        label: 'Transfers',
        icon: <ArrowLeftRight size={18} />,
        roles: ['store_manager', 'supervisor', 'manager', 'md'],
        children: [{ type: 'leaf', label: 'All Transfers', to: '/transfers' }]
      },
      {
        type: 'group',
        label: 'Production',
        icon: <Wrench size={18} />,
        roles: ['store_manager', 'manager'],
        children: [
          { type: 'leaf', label: 'Batches', to: '/production' },
          { type: 'leaf', label: 'Variances', to: '/production/variances' },
          { type: 'leaf', label: 'Thresholds', to: '/variance-thresholds' }
        ]
      },
      {
        type: 'group',
        label: 'Staff Meals',
        icon: <Users size={18} />,
        roles: ['store_manager', 'supervisor', 'manager'],
        children: [
          { type: 'leaf', label: 'All Meals', to: '/staff-meals' },
          { type: 'leaf', label: 'Daily View', to: '/staff-meals/daily' }
        ]
      },
      {
        type: 'group',
        label: 'Operations',
        icon: <Layers size={18} />,
        roles: ['store_manager', 'supervisor', 'manager'],
        children: [
          { type: 'leaf', label: 'Waste', to: '/waste' },
          { type: 'leaf', label: 'Returns', to: '/returns' },
          { type: 'leaf', label: 'Disputes', to: '/disputes' }
        ]
      }
    ]
  },
  {
    title: 'Management',
    items: [
      {
        type: 'group',
        label: 'Menu',
        icon: <MenuIcon size={18} />,
        roles: ['manager', 'md', 'admin', 'supervisor', 'store_manager'],
        children: [
          { type: 'leaf', label: 'Master Items', to: '/menu/master-items' },
          { type: 'leaf', label: 'Menu Items', to: '/menu' },
          {
            type: 'leaf',
            label: 'Portion Definitions',
            to: '/portion-definitions'
          },
          { type: 'leaf', label: 'Recipes', to: '/recipes' },
          { type: 'leaf', label: 'Staff Menu', to: '/staff-menu' }
        ]
      },
      {
        type: 'leaf',
        label: 'Properties',
        to: '/properties',
        icon: <Building2 size={18} />,
        roles: ['manager', 'md', 'admin']
      },
      {
        type: 'leaf',
        label: 'Users',
        to: '/users',
        icon: <Users size={18} />,
        roles: ['manager', 'md', 'admin']
      },
      {
        type: 'leaf',
        label: 'Reports',
        to: '/reports',
        icon: <BarChart3 size={18} />,
        roles: ['manager', 'md']
      },
      {
        type: 'group',
        label: 'System',
        icon: <BarChart3 size={18} />,
        roles: ['manager', 'md', 'admin'],
        children: [
          { type: 'leaf', label: 'Adjustments', to: '/adjustments' },
          { type: 'leaf', label: 'Reconciliation', to: '/reconciliation' },
          { type: 'leaf', label: 'Exceptions', to: '/exceptions' },
          { type: 'leaf', label: 'Audit Log', to: '/audit' }
        ]
      }
    ]
  }
]

export function AppShell ({ children }: { children?: ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure()
  const auth = useAuth()
  const navigate = useNavigate()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  if (!auth.isReady || !auth.user) {
    return (
      <Center h='100vh'>
        <Loader />
      </Center>
    )
  }

  const canSee = (roles?: string[]) => {
    if (!roles) return true
    return roles.some(r => auth.hasRole(r))
  }

  const allLeafPaths = navSections.flatMap(section =>
    section.items.flatMap(item =>
      item.type === 'leaf' ? [item.to] : item.children.map(c => c.to)
    )
  )

  const activePath = allLeafPaths
    .filter(path => currentPath === path || currentPath.startsWith(path + '/'))
    .sort((a, b) => b.length - a.length)[0]

  const initial = auth.user.full_name?.[0] ?? '?'
  const primaryRole = auth.user.roles[0]?.code

  return (
    <MantineAppShell
      header={{ height: { base: 56, sm: 60 } }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding={{ base: 'sm', sm: 'md' }}
    >
      <MantineAppShell.Header
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-2)',
          background: 'white'
        }}
      >
        <Group
          h='100%'
          px={{ base: 'sm', sm: 'md' }}
          justify='space-between'
          wrap='nowrap'
        >
          <Group gap='xs' wrap='nowrap' style={{ minWidth: 0, flex: 1 }}>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom='sm'
              size='sm'
              aria-label='Toggle navigation'
            />
            <Group gap={8} wrap='nowrap' style={{ minWidth: 0 }}>
              <ThemeIcon
                size={30}
                radius='md'
                variant='gradient'
                gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
                style={{ flexShrink: 0 }}
              >
                <Package size={16} />
              </ThemeIcon>
              {/* Hide long title on mobile, show short version */}
              <Text
                fw={700}
                size='md'
                style={{ letterSpacing: '-0.01em' }}
                visibleFrom='sm'
                truncate
              >
                Straight Inventory
              </Text>
              <Text
                fw={700}
                size='sm'
                style={{ letterSpacing: '-0.01em' }}
                hiddenFrom='sm'
                truncate
              >
                Straight
              </Text>
            </Group>
          </Group>

          <Menu shadow='md' width={220} position='bottom-end' radius='md'>
            <Menu.Target>
              <UnstyledButton
                style={{
                  padding: '4px 6px',
                  borderRadius: 10,
                  transition: 'background 120ms ease',
                  flexShrink: 0
                }}
              >
                <Group gap='xs' wrap='nowrap'>
                  <Avatar size={30} radius='xl' color='blue'>
                    {initial}
                  </Avatar>
                  <Box visibleFrom='sm'>
                    <Text size='sm' fw={600} lh={1.1}>
                      {auth.user.full_name}
                    </Text>
                    {primaryRole && (
                      <Text size='xs' c='dimmed' lh={1.2}>
                        {primaryRole}
                      </Text>
                    )}
                  </Box>
                  <ChevronDown
                    size={14}
                    opacity={0.5}
                    style={{ display: 'var(--mantine-hidden-from-sm-display, block)' }}
                  />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{auth.user.username}</Menu.Label>
              <Menu.Divider />
              <Menu.Item
                color='red'
                leftSection={<LogOut size={14} />}
                onClick={() => {
                  auth.logout()
                  window.location.replace('/login')
                }}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar
        p={0}
        style={{
          background: '#0f172a',
          borderRight: '1px solid #1e293b'
        }}
      >
        <ScrollArea style={{ flex: 1 }} scrollbarSize={6} type='hover'>
          <Stack gap={0} p='sm'>
            {navSections.map((section, sIdx) => {
              const visibleItems = section.items.filter(item =>
                canSee(item.roles)
              )
              if (visibleItems.length === 0) return null

              return (
                <Box
                  key={section.title}
                  mb={sIdx === navSections.length - 1 ? 0 : 4}
                >
                  <Text
                    size='xs'
                    fw={600}
                    tt='uppercase'
                    px='sm'
                    pt={sIdx === 0 ? 4 : 16}
                    pb={6}
                    style={{
                      letterSpacing: 1,
                      color: 'rgba(255,255,255,0.4)'
                    }}
                  >
                    {section.title}
                  </Text>

                  <Stack gap={2}>
                    {visibleItems.map(item => {
                      if (item.type === 'leaf') {
                        const active = activePath === item.to
                        return (
                          <NavLink
                            key={item.to}
                            component={Link}
                            to={item.to}
                            label={item.label}
                            leftSection={item.icon}
                            active={active}
                            onClick={close}
                            styles={navLinkStyles(active)}
                          />
                        )
                      }

                      const childVisible = item.children.filter(c =>
                        canSee(c.roles)
                      )
                      if (childVisible.length === 0) return null

                      const groupActive = childVisible.some(
                        c => activePath === c.to
                      )

                      return (
                        <NavLink
                          key={item.label}
                          label={item.label}
                          leftSection={item.icon}
                          defaultOpened={groupActive}
                          active={groupActive}
                          styles={navLinkStyles(groupActive)}
                          rightSection={
                            <ChevronRight
                              size={14}
                              style={{
                                transition: 'transform 150ms ease',
                                opacity: 0.5
                              }}
                            />
                          }
                        >
                          {childVisible.map(child => {
                            const active = activePath === child.to
                            return (
                              <NavLink
                                key={child.to}
                                component={Link}
                                to={child.to}
                                label={child.label}
                                active={active}
                                onClick={close}
                                styles={subNavLinkStyles(active)}
                              />
                            )
                          })}
                        </NavLink>
                      )
                    })}
                  </Stack>
                </Box>
              )
            })}
          </Stack>
        </ScrollArea>

        <Box
          p='sm'
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.2)'
          }}
        >
          <Group gap='xs' wrap='nowrap'>
            <Avatar size={32} radius='xl' color='blue'>
              {initial}
            </Avatar>
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Text size='xs' fw={600} c='white' truncate>
                {auth.user.full_name}
              </Text>
              <Text
                size='xs'
                truncate
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                @{auth.user.username}
              </Text>
            </Box>
            <UnstyledButton
              onClick={() => {
                auth.logout()
                window.location.replace('/login')
              }}
              style={{
                padding: 6,
                borderRadius: 8,
                color: 'rgba(255,255,255,0.6)'
              }}
              title='Logout'
            >
              <LogOut size={16} />
            </UnstyledButton>
          </Group>
        </Box>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main
        style={{ background: 'var(--mantine-color-gray-0)' }}
      >
        {children ?? <Outlet />}
      </MantineAppShell.Main>
    </MantineAppShell>
  )
}

function navLinkStyles (active: boolean) {
  return {
    root: {
      borderRadius: 8,
      padding: '8px 12px',
      color: active ? 'white' : 'rgba(255,255,255,0.72)',
      background: active ? 'rgba(59,130,246,0.18)' : 'transparent',
      fontWeight: active ? 600 : 500,
      transition: 'background 120ms ease, color 120ms ease',
      '&:hover': {
        background: active ? 'rgba(59,130,246,0.22)' : 'rgba(255,255,255,0.06)',
        color: 'white'
      },
      '&[data-active]': {
        background: 'rgba(59,130,246,0.18)',
        color: 'white'
      }
    },
    label: { fontSize: 13.5 },
    section: {
      color: active ? 'var(--mantine-color-blue-4)' : 'inherit'
    }
  } as const
}

function subNavLinkStyles (active: boolean) {
  return {
    root: {
      borderRadius: 6,
      padding: '6px 12px 6px 40px',
      color: active ? 'white' : 'rgba(255,255,255,0.6)',
      background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
      fontWeight: active ? 600 : 400,
      transition: 'background 120ms ease, color 120ms ease',
      '&:hover': {
        background: 'rgba(255,255,255,0.06)',
        color: 'white'
      },
      '&[data-active]': {
        background: 'rgba(59,130,246,0.15)',
        color: 'white'
      }
    },
    label: { fontSize: 13 }
  } as const
}

