// import { createFileRoute, Link } from '@tanstack/react-router';
// import {
//   Badge,
//   Card,
//   Grid,
//   Group,
//   SimpleGrid,
//   Stack,
//   Text,
//   Title,
// } from '@mantine/core';
// import {
// Calendar, Clock, Building2, Users
// } from 'lucide-react';
// import { useAuth } from '@/lib/auth/useAuth';
// import {
//   useCurrentBusinessDay,
//   useCurrentShift,
//   useProperties,
//   useUsers,
// } from '@/hooks/useCore';
// import { PageHeader } from '@/components/PageHeader';
// import { formatDate, formatDateTime } from '@/lib/utils/format';

// export const Route = createFileRoute('/_app/dashboard')({
//   component: DashboardPage,
// });

// function StatCard({
//   icon,
//   label,
//   value,
//   sublabel,
//   color = 'blue',
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: React.ReactNode;
//   sublabel?: string;
//   color?: string;
// }) {
//   return (
//     <Card withBorder padding="lg">
//       <Group justify="space-between" mb="xs">
//         <Text size="sm" c="dimmed" fw={500}>
//           {label}
//         </Text>
//         <Badge color={color} variant="light" size="lg" circle>
//           {icon}
//         </Badge>
//       </Group>
//       <Text size="xl" fw={700}>
//         {value}
//       </Text>
//       {sublabel && (
//         <Text size="xs" c="dimmed" mt={4}>
//           {sublabel}
//         </Text>
//       )}
//     </Card>
//   );
// }

// function DashboardPage() {
//   const auth = useAuth();

//   const businessDay = useCurrentBusinessDay();
//   const shift = useCurrentShift();
//   const properties = useProperties(1, 5);
//   const users = useUsers(1, 1);

//   const propertyLabel =
//     auth.user?.roles[0]?.property_code ||
//     (auth.user?.primary_property_id ? 'Your Property' : 'Group');

//   return (
//     <>
//       <PageHeader
//         title={`Welcome, ${auth.user?.full_name}`}
//         subtitle={`${auth.user?.roles.map((r) => r.code).join(', ')} • ${propertyLabel}`}
//       />

//       <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="lg">
//         <StatCard
//           icon={<Calendar size={18} />}
//           label="Business Day"
//           value={
//             businessDay.isLoading
//               ? '…'
//               : businessDay.data
//               ? formatDate(businessDay.data.business_date)
//               : 'Not open'
//           }
//           sublabel={
//             businessDay.data
//               ? `Opened ${formatDateTime(businessDay.data.opened_at)}`
//               : 'No open business day'
//           }
//           color="blue"
//         />
//         <StatCard
//           icon={<Clock size={18} />}
//           label="Current Shift"
//           value={
//             shift.isLoading
//               ? '…'
//               : shift.data
//               ? shift.data.name
//               : 'Not open'
//           }
//           sublabel={
//             shift.data
//               ? `Opened ${formatDateTime(shift.data.opened_at)}`
//               : 'No open shift'
//           }
//           color="green"
//         />
//         <StatCard
//           icon={<Building2 size={18} />}
//           label="Properties"
//           value={properties.isLoading ? '…' : properties.data?.meta.total ?? 0}
//           sublabel={
//             auth.hasRole('md', 'admin')
//               ? 'All properties'
//               : 'Accessible to you'
//           }
//           color="violet"
//         />
//         <StatCard
//           icon={<Users size={18} />}
//           label="Users"
//           value={users.isLoading ? '…' : users.data?.meta.total ?? 0}
//           sublabel={auth.hasRole('md', 'admin') ? 'All users' : 'Property users'}
//           color="orange"
//         />
//       </SimpleGrid>

//       <Grid>
//         <Grid.Col span={{ base: 12, md: 6 }}>
//           <Card withBorder padding="lg">
//             <Title order={4} mb="sm">
//               Quick links
//             </Title>
//             <Stack gap="xs">
//               {auth.hasRole('waiter', 'supervisor', 'manager') && (
//                 <Text component={Link} to="/orders/new" c="blue">
//                   + New Order
//                 </Text>
//               )}
//               {auth.hasRole('store_manager', 'manager') && (
//                 <Text component={Link} to="/stock/batches" c="blue">
//                   → Stock batches
//                 </Text>
//               )}
//               {auth.hasRole('cashier', 'manager') && (
//                 <Text component={Link} to="/payments" c="blue">
//                   → Payments
//                 </Text>
//               )}
//               {auth.hasRole('manager', 'md') && (
//                 <Text component={Link} to="/reports" c="blue">
//                   → Reports
//                 </Text>
//               )}
//             </Stack>
//           </Card>
//         </Grid.Col>

//         <Grid.Col span={{ base: 12, md: 6 }}>
//           <Card withBorder padding="lg">
//             <Title order={4} mb="sm">
//               Your access
//             </Title>
//             <Stack gap={6}>
//               <Group gap="xs">
//                 <Text size="sm" fw={500}>
//                   Roles:
//                 </Text>
//                 {auth.user?.roles.map((r) => (
//                   <Badge key={r.code} variant="light">
//                     {r.code}
//                   </Badge>
//                 ))}
//               </Group>
//               <Group gap="xs">
//                 <Text size="sm" fw={500}>
//                   Permissions:
//                 </Text>
//                 <Text size="sm" c="dimmed">
//                   {auth.user?.permissions.length ?? 0} granted
//                 </Text>
//               </Group>
//             </Stack>
//           </Card>
//         </Grid.Col>
//       </Grid>
//     </>
//   );
// }






























import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Badge,
  Card,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  ThemeIcon,
  Anchor,
  Box,
} from '@mantine/core';
import { Calendar, Clock, Building2, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';
import {
  useCurrentBusinessDay,
  useCurrentShift,
  useProperties,
  useUsers,
} from '@/hooks/useCore';
import { PageHeader } from '@/components/PageHeader';
import { formatDate, formatDateTime } from '@/lib/utils/format';

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
});

function StatCard({
  icon,
  label,
  value,
  sublabel,
  color = 'blue',
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sublabel?: string;
  color?: string;
}) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" align="flex-start" mb="sm">
        <Text size="xs" c="dimmed" fw={600} tt="uppercase" style={{ letterSpacing: 0.5 }}>
          {label}
        </Text>
        <ThemeIcon size={32} radius="md" variant="light" color={color}>
          {icon}
        </ThemeIcon>
      </Group>
      <Text size="xl" fw={700} style={{ letterSpacing: '-0.01em' }}>
        {value}
      </Text>
      {sublabel && (
        <Text size="xs" c="dimmed" mt={6}>
          {sublabel}
        </Text>
      )}
    </Card>
  );
}

function QuickLink({
  to,
  children,
  show,
}: {
  to: string;
  children: React.ReactNode;
  show: boolean;
}) {
  if (!show) return null;
  return (
    <Anchor
      component={Link}
      to={to}
      size="sm"
      fw={500}
      underline="never"
      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
    >
      <ArrowRight size={14} />
      {children}
    </Anchor>
  );
}

function DashboardPage() {
  const auth = useAuth();

  const businessDay = useCurrentBusinessDay();
  const shift = useCurrentShift();
  const properties = useProperties(1, 5);
  const users = useUsers(1, 1);

  const propertyLabel =
    auth.user?.roles[0]?.property_code ||
    (auth.user?.primary_property_id ? 'Your Property' : 'Group');

  return (
    <>
      <PageHeader
        title={`Welcome, ${auth.user?.full_name}`}
        subtitle={`${auth.user?.roles.map((r) => r.code).join(', ')} • ${propertyLabel}`}
      />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="lg">
        <StatCard
          icon={<Calendar size={16} />}
          label="Business Day"
          value={
            businessDay.isLoading
              ? '…'
              : businessDay.data
              ? formatDate(businessDay.data.business_date)
              : 'Not open'
          }
          sublabel={
            businessDay.data
              ? `Opened ${formatDateTime(businessDay.data.opened_at)}`
              : 'No open business day'
          }
          color="blue"
        />
        <StatCard
          icon={<Clock size={16} />}
          label="Current Shift"
          value={
            shift.isLoading ? '…' : shift.data ? shift.data.name : 'Not open'
          }
          sublabel={
            shift.data
              ? `Opened ${formatDateTime(shift.data.opened_at)}`
              : 'No open shift'
          }
          color="green"
        />
        <StatCard
          icon={<Building2 size={16} />}
          label="Properties"
          value={properties.isLoading ? '…' : properties.data?.meta.total ?? 0}
          sublabel={
            auth.hasRole('md', 'admin') ? 'All properties' : 'Accessible to you'
          }
          color="violet"
        />
        {auth.hasPermission('user.manage') && (
          <StatCard
            icon={<Users size={16} />}
            label="Users"
            value={users.isLoading ? '…' : users.data?.meta.total ?? 0}
            sublabel={auth.hasRole('md', 'admin') ? 'All users' : 'Property users'}
            color="orange"
          />
        )}
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" padding="lg">
            <Title order={5} fw={600} mb="md">
              Quick links
            </Title>
            <Stack gap="sm">
              <QuickLink to="/orders/new" show={auth.hasRole('waiter', 'supervisor', 'manager')}>
                New Order
              </QuickLink>
              <QuickLink to="/stock/batches" show={auth.hasRole('store_manager', 'manager')}>
                Stock batches
              </QuickLink>
              <QuickLink to="/payments" show={auth.hasRole('cashier', 'manager')}>
                Payments
              </QuickLink>
              <QuickLink to="/reports" show={auth.hasRole('manager', 'md')}>
                Reports
              </QuickLink>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" padding="lg">
            <Title order={5} fw={600} mb="md">
              Your access
            </Title>
            <Stack gap="sm">
              <Box>
                <Text size="xs" c="dimmed" fw={600} tt="uppercase" mb={6} style={{ letterSpacing: 0.5 }}>
                  Roles
                </Text>
                <Group gap={6}>
                  {auth.user?.roles.map((r) => (
                    <Badge key={r.code} variant="light" radius="sm" size="md">
                      {r.code}
                    </Badge>
                  ))}
                </Group>
              </Box>
              <Box>
                <Text size="xs" c="dimmed" fw={600} tt="uppercase" mb={4} style={{ letterSpacing: 0.5 }}>
                  Permissions
                </Text>
                <Text size="sm">
                  {auth.user?.permissions.length ?? 0} granted
                </Text>
              </Box>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  );
}