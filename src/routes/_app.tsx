import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppShell } from '@/components/AppShell';
import { AppShellMobile } from '@/components/AppShellMobile';
import { useAuth } from '@/lib/auth/useAuth';
import { useIsMobile } from '@/hooks/useIsMobile';

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

// Roles that get the phone-first bottom-bar shell on small screens.
// Anyone who also holds a broader role keeps the full sidebar.
const MOBILE_SHELL_ROLES = ['waiter'];

function AppLayout() {
  const auth = useAuth();
  const isMobile = useIsMobile();

  const roleCodes = auth.user?.roles.map((r) => r.code) ?? [];
  const mobileOnly =
    roleCodes.length > 0 && roleCodes.every((code) => MOBILE_SHELL_ROLES.includes(code));

  if (isMobile && mobileOnly) {
    return (
      <AppShellMobile>
        <Outlet />
      </AppShellMobile>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
