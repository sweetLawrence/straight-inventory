// // import { createFileRoute, useNavigate } from '@tanstack/react-router';
// // import {
// //   Button,
// //   Container,
// //   Paper,
// //   PasswordInput,
// //   Stack,
// //   Text,
// //   TextInput,
// //   Title,
// // } from '@mantine/core';
// // import { useForm } from '@mantine/form';
// // import { notifications } from '@mantine/notifications';
// // import { useState } from 'react';
// // import { getErrorMessage } from '@/lib/api/client';

// // export const Route = createFileRoute('/login')({
// //   component: LoginPage,
// // });

// // function LoginPage() {
// //   const auth = Route.useRouteContext().auth;
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(false);

// //   const form = useForm({
// //     initialValues: {
// //       username: '',
// //       password: '',
// //     },
// //     validate: {
// //       username: (v) => (v ? null : 'Username is required'),
// //       password: (v) => (v ? null : 'Password is required'),
// //     },
// //   });

// //   const handleSubmit = async (values: typeof form.values) => {
// //     setLoading(true);
// //     try {
// //       await auth.login(values.username, values.password);
// //       navigate({ to: '/dashboard' });
// //     } catch (err) {
// //       notifications.show({
// //         color: 'red',
// //         title: 'Login failed',
// //         message: getErrorMessage(err),
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //       <Container size={420} w="100%">
// //         <Title ta="center" mb="xs">
// //           Straight Group
// //         </Title>
// //         <Text c="dimmed" size="sm" ta="center" mb="lg">
// //           Inventory Tracking System
// //         </Text>

// //         <Paper withBorder shadow="md" p="lg" radius="md">
// //           <form onSubmit={form.onSubmit(handleSubmit)}>
// //             <Stack>
// //               <TextInput
// //                 label="Username"
// //                 placeholder="e.g. john.w"
// //                 required
// //                 {...form.getInputProps('username')}
// //               />
// //               <PasswordInput
// //                 label="Password"
// //                 placeholder="Your password"
// //                 required
// //                 {...form.getInputProps('password')}
// //               />
// //               <Button type="submit" loading={loading} fullWidth mt="md">
// //                 Sign in
// //               </Button>
// //             </Stack>
// //           </form>
// //         </Paper>

// //         <Text c="dimmed" size="xs" ta="center" mt="md">
// //           Demo: john.w / password123
// //         </Text>
// //       </Container>
// //     </div>
// //   );
// // }










// // import { createFileRoute, useNavigate } from '@tanstack/react-router';
// // import {
// //   Button,
// //   Container,
// //   Paper,
// //   PasswordInput,
// //   Stack,
// //   Text,
// //   TextInput,
// //   Title,
// // } from '@mantine/core';
// // import { useForm } from '@mantine/form';
// // import { notifications } from '@mantine/notifications';
// // import { useState } from 'react';
// // import { getErrorMessage } from '@/lib/api/client';

// // export const Route = createFileRoute('/login')({
// //   component: LoginPage,
// // });

// // function LoginPage() {
// //   const auth = Route.useRouteContext().auth;
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(false);

// //   const form = useForm({
// //     initialValues: {
// //       username: '',
// //       password: '',
// //     },
// //     validate: {
// //       username: (v) => (v ? null : 'Username is required'),
// //       password: (v) => (v ? null : 'Password is required'),
// //     },
// //   });

// //   const handleSubmit = async (values: typeof form.values) => {
// //     setLoading(true);
// //     try {
// //       await auth.login(values.username, values.password);
// //       navigate({ to: '/dashboard' });
// //     } catch (err) {
// //       notifications.show({
// //         color: 'red',
// //         title: 'Login failed',
// //         message: getErrorMessage(err),
// //       });
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //       <Container size={420} w="100%">
// //         <Title ta="center" mb="xs">
// //           Straight Group
// //         </Title>
// //         <Text c="dimmed" size="sm" ta="center" mb="lg">
// //           Inventory Tracking System
// //         </Text>

// //         <Paper withBorder shadow="md" p="lg" radius="md">
// //           <form onSubmit={form.onSubmit(handleSubmit)}>
// //             <Stack>
// //               <TextInput
// //                 label="Username"
// //                 placeholder="e.g. john.w"
// //                 required
// //                 {...form.getInputProps('username')}
// //               />
// //               <PasswordInput
// //                 label="Password"
// //                 placeholder="Your password"
// //                 required
// //                 {...form.getInputProps('password')}
// //               />
// //               <Button type="submit" loading={loading} fullWidth mt="md">
// //                 Sign in
// //               </Button>
// //             </Stack>
// //           </form>
// //         </Paper>

// //         <Text c="dimmed" size="xs" ta="center" mt="md">
// //           Demo: john.w / password123
// //         </Text>
// //       </Container>
// //     </div>
// //   );
// // }






// // import { createFileRoute } from '@tanstack/react-router';
// // import {
// //   Button,
// //   Container,
// //   Paper,
// //   PasswordInput,
// //   Stack,
// //   Text,
// //   TextInput,
// //   Title,
// // } from '@mantine/core';
// // import { useForm } from '@mantine/form';
// // import { notifications } from '@mantine/notifications';
// // import { useState } from 'react';
// // import { getErrorMessage } from '@/lib/api/client';

// // export const Route = createFileRoute('/login')({
// //   component: LoginPage,
// // });

// // function LoginPage() {
// //   const auth = Route.useRouteContext().auth;
// //   const [loading, setLoading] = useState(false);

// //   const form = useForm({
// //     initialValues: {
// //       username: '',
// //       password: '',
// //     },
// //     validate: {
// //       username: (v) => (v ? null : 'Username is required'),
// //       password: (v) => (v ? null : 'Password is required'),
// //     },
// //   });

// //   const handleSubmit = async (values: typeof form.values) => {
// //     setLoading(true);
// //     try {
// //       await auth.login(values.username, values.password);
// //       // Hard redirect - AuthProvider hydrates from localStorage on next boot
// //       window.location.replace('/dashboard');
// //       // No setLoading(false) - page is navigating away
// //     } catch (err) {
// //       notifications.show({
// //         color: 'red',
// //         title: 'Login failed',
// //         message: getErrorMessage(err),
// //       });
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //       <Container size={420} w="100%">
// //         <Title ta="center" mb="xs">
// //           Straight Group
// //         </Title>
// //         <Text c="dimmed" size="sm" ta="center" mb="lg">
// //           Inventory Tracking System
// //         </Text>

// //         <Paper withBorder shadow="md" p="lg" radius="md">
// //           <form onSubmit={form.onSubmit(handleSubmit)}>
// //             <Stack>
// //               <TextInput
// //                 label="Username"
// //                 placeholder="e.g. john.w"
// //                 required
// //                 {...form.getInputProps('username')}
// //               />
// //               <PasswordInput
// //                 label="Password"
// //                 placeholder="Your password"
// //                 required
// //                 {...form.getInputProps('password')}
// //               />
// //               <Button type="submit" loading={loading} fullWidth mt="md">
// //                 Sign in
// //               </Button>
// //             </Stack>
// //           </form>
// //         </Paper>

// //         <Text c="dimmed" size="xs" ta="center" mt="md">
// //           Demo: john.w / password123
// //         </Text>
// //       </Container>
// //     </div>
// //   );
// // }

















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
//       // Hard redirect - AuthProvider hydrates from localStorage on next boot
//       window.location.replace('/dashboard');
//       // No setLoading(false) - page is navigating away
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
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <Container size={420} w="100%">
//         <Title ta="center" mb="xs">
//           Straight Group
//         </Title>
//         <Text c="dimmed" size="sm" ta="center" mb="lg">
//           Inventory Tracking System
//         </Text>

//         <Paper withBorder shadow="md" p="lg" radius="md">
//           <form onSubmit={form.onSubmit(handleSubmit)}>
//             <Stack>
//               <TextInput
//                 label="Username"
//                 placeholder="e.g. john.w"
//                 required
//                 {...form.getInputProps('username')}
//               />
//               <PasswordInput
//                 label="Password"
//                 placeholder="Your password"
//                 required
//                 {...form.getInputProps('password')}
//               />
//               <Button type="submit" loading={loading} fullWidth mt="md">
//                 Sign in
//               </Button>
//             </Stack>
//           </form>
//         </Paper>

//         <Text c="dimmed" size="xs" ta="center" mt="md">
//           Demo: john.w / password123
//         </Text>
//       </Container>
//     </div>
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
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { getErrorMessage } from '@/lib/api/client';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

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
      <Container size={400} w="100%" px="md">
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
        <Paper withBorder radius="md" p="xl" shadow="xs">
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

        {/* Demo credentials */}
        <Group justify="center" gap={6} mt="lg">
          <Text size="xs" c="dimmed">
            Demo:
          </Text>
          <Text size="xs" c="dimmed" ff="monospace">
            john.w
          </Text>
          <Text size="xs" c="dimmed">
            /
          </Text>
          <Text size="xs" c="dimmed" ff="monospace">
            password123
          </Text>
        </Group>
      </Container>
    </Box>
  );
}