// import {
//   createFileRoute,
//   Outlet,
//   redirect,
//   useNavigate,
// } from '@tanstack/react-router';
// import { AppShell } from '@/components/AppShell';

// export const Route = createFileRoute('/_app')({
//   beforeLoad: ({ context, location }) => {
//     if (!context.auth.isReady) {
//       // wait for auth bootstrap
//       return;
//     }
//     if (!context.auth.isAuthenticated) {
//       throw redirect({
//         to: '/login',
//         search: { redirect: location.href },
//       });
//     }
//   },
//   component: AppLayout,
// });

// function AppLayout() {
//   return (
//     <AppShell>
//       <Outlet />
//     </AppShell>
//   );
// }






import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppShell } from '@/components/AppShell';

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}