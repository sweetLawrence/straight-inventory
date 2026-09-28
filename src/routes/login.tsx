// import { createFileRoute } from '@tanstack/react-router';
// import {
//   Button,
//   Container,
//   Paper,
//   PasswordInput,
//   Stack,
//   Text,
//   TextInput,
//   Title,
//   Box,
//   Group,
//   ThemeIcon,
//   Divider,
// } from '@mantine/core';
// import { useForm } from '@mantine/form';
// import { notifications } from '@mantine/notifications';
// import { useState } from 'react';
// import { getErrorMessage } from '@/lib/api/client';

// export const Route = createFileRoute('/login')({
//   component: LoginPage,
// });

// function LoginPage() {
//   const auth = Route.useRouteContext().auth;
//   const [loading, setLoading] = useState(false);

//   const form = useForm({
//     initialValues: {
//       username: '',
//       password: '',
//     },
//     validate: {
//       username: (v) => (v ? null : 'Username is required'),
//       password: (v) => (v ? null : 'Password is required'),
//     },
//   });

//   const handleSubmit = async (values: typeof form.values) => {
//     setLoading(true);
//     try {
//       await auth.login(values.username, values.password);
//       window.location.replace('/dashboard');
//     } catch (err) {
//       notifications.show({
//         color: 'red',
//         title: 'Login failed',
//         message: getErrorMessage(err),
//       });
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       style={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: '#f8f9fa',
//       }}
//     >
//       <Container size={400} w="100%" px="md">
//         {/* Brand */}
//         <Stack align="center" gap={8} mb={32}>
//           <ThemeIcon size={44} radius="md" variant="light" color="blue">
//             <svg
//               width="22"
//               height="22"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
//               <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
//               <line x1="12" y1="22.08" x2="12" y2="12" />
//             </svg>
//           </ThemeIcon>
//           <Title order={3} fw={600} style={{ letterSpacing: '-0.01em' }}>
//             Straight Group
//           </Title>
//           <Text size="sm" c="dimmed">
//             Inventory Tracking System
//           </Text>
//         </Stack>

//         {/* Card */}
//         <Paper withBorder radius="md" p="xl" shadow="xs">
//           <form onSubmit={form.onSubmit(handleSubmit)}>
//             <Stack gap="md">
//               <TextInput
//                 label="Username"
//                 placeholder="e.g. john.w"
//                 required
//                 size="md"
//                 radius="md"
//                 {...form.getInputProps('username')}
//               />
//               <PasswordInput
//                 label="Password"
//                 placeholder="Your password"
//                 required
//                 size="md"
//                 radius="md"
//                 {...form.getInputProps('password')}
//               />
//               <Button
//                 type="submit"
//                 loading={loading}
//                 fullWidth
//                 size="md"
//                 radius="md"
//                 mt="xs"
//               >
//                 Sign in
//               </Button>
//             </Stack>
//           </form>
//         </Paper>

//         {/* Demo credentials */}
//         <Group justify="center" gap={6} mt="lg">
//           <Text size="xs" c="dimmed">
//             Demo:
//           </Text>
//           <Text size="xs" c="dimmed" ff="monospace">
//             john.w
//           </Text>
//           <Text size="xs" c="dimmed">
//             /
//           </Text>
//           <Text size="xs" c="dimmed" ff="monospace">
//             password123
//           </Text>
//         </Group>

//         <Group justify="center" gap={6} mt="lg">
//           <Text size="xs" c="dimmed">
//             Demo:
//           </Text>
//           <Text size="xs" c="dimmed" ff="monospace">
//             alice.c
//           </Text>
//           <Text size="xs" c="dimmed">
//             /
//           </Text>
//           <Text size="xs" c="dimmed" ff="monospace">
//             password123
//           </Text>
//         </Group>

//         <Group justify="center" gap={6} mt="lg">
//           <Text size="xs" c="dimmed">
//             Demo:
//           </Text>
//           <Text size="xs" c="dimmed" ff="monospace">
//             peter.s
//           </Text>
//           <Text size="xs" c="dimmed">
//             /
//           </Text>
//           <Text size="xs" c="dimmed" ff="monospace">
//             password123
//           </Text>
//         </Group>

// <Group justify="center" gap={6} mt="lg">
//           <Text size="xs" c="dimmed">
//             Demo:
//           </Text>
//           <Text size="xs" c="dimmed" ff="monospace">
//             james.b
//           </Text>
//           <Text size="xs" c="dimmed">
//             /
//           </Text>
//           <Text size="xs" c="dimmed" ff="monospace">
//             password123
//           </Text>
//         </Group>

//         <Group justify="center" gap={6} mt="lg">
//           <Text size="xs" c="dimmed">
//             Demo:
//           </Text>
//           <Text size="xs" c="dimmed" ff="monospace">
//             david.m
//           </Text>
//           <Text size="xs" c="dimmed">
//             /
//           </Text>
//           <Text size="xs" c="dimmed" ff="monospace">
//             password123
//           </Text>
//         </Group>

//         <Group justify="center" gap={6} mt="lg">
//           <Text size="xs" c="dimmed">
//             Demo:
//           </Text>
//           <Text size="xs" c="dimmed" ff="monospace">
//             md
//           </Text>
//           <Text size="xs" c="dimmed">
//             /
//           </Text>
//           <Text size="xs" c="dimmed" ff="monospace">
//             password123
//           </Text>
//         </Group>

//       </Container>
//     </Box>
//   );
// }















import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  Box,
  Group,
  ThemeIcon,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { getErrorMessage } from '@/lib/api/client';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

const DEMO_CREDENTIALS = [
  { username: 'john.w', password: 'password123' },
  { username: 'alice.c', password: 'password123' },
  { username: 'peter.s', password: 'password123' },
  { username: 'james.b', password: 'password123' },
  { username: 'david.m', password: 'password123' },
  { username: 'md', password: 'password123' },
];

function LoginPage() {
  const auth = Route.useRouteContext().auth;
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (v) => (v ? null : 'Username is required'),
      password: (v) => (v ? null : 'Password is required'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await auth.login(values.username, values.password);
      window.location.replace('/dashboard');
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Login failed',
        message: getErrorMessage(err),
      });
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa',
      }}
    >
      <Container size="lg" w="100%" px="md">
        <Group align="flex-start" justify="center" gap="xl" wrap="nowrap">
          {/* Login form */}
          <Stack align="center" gap={8} w={400}>
            {/* Brand */}
            <Stack align="center" gap={8} mb={32}>
              <ThemeIcon size={44} radius="md" variant="light" color="blue">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </ThemeIcon>
              <Title order={3} fw={600} style={{ letterSpacing: '-0.01em' }}>
                Straight Group
              </Title>
              <Text size="sm" c="dimmed">
                Inventory Tracking System
              </Text>
            </Stack>

            {/* Card */}
            <Paper withBorder radius="md" p="xl" shadow="xs" w="100%">
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                  <TextInput
                    label="Username"
                    placeholder="e.g. john.w"
                    required
                    size="md"
                    radius="md"
                    {...form.getInputProps('username')}
                  />
                  <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    required
                    size="md"
                    radius="md"
                    {...form.getInputProps('password')}
                  />
                  <Button
                    type="submit"
                    loading={loading}
                    fullWidth
                    size="md"
                    radius="md"
                    mt="xs"
                  >
                    Sign in
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Stack>

          {/* Demo credentials */}
          <Paper
            withBorder
            radius="md"
            p="lg"
            shadow="xs"
            w={280}
            style={{ marginTop: 100 }}
          >
            <Group justify="space-between" mb="md">
              <Text size="sm" fw={600}>
                Demo Credentials
              </Text>
              <Badge color="orange" variant="light" size="sm">
                Dev only
              </Badge>
            </Group>

            <Text size="xs" c="dimmed" mb="md">
              These accounts will be removed in production.
            </Text>

            <Stack gap="xs">
              {DEMO_CREDENTIALS.map((cred) => (
                <Group key={cred.username} justify="space-between" gap="xs">
                  <Text size="xs" ff="monospace" c="dimmed">
                    {cred.username}
                  </Text>
                  <Text size="xs" ff="monospace" c="dimmed">
                    {cred.password}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Group>
      </Container>
    </Box>
  );
}