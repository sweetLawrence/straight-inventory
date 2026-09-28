import { Group, Title, Text, Button, Stack } from '@mantine/core';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  // subtitle?: string;
  subtitle?: ReactNode; 
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Group justify="space-between" align="flex-start" mb="lg">
      <Stack gap={2}>
        <Title order={2}>{title}</Title>
        {subtitle && (
          <Text c="dimmed" size="sm">
            {subtitle}
          </Text>
        )}
      </Stack>
      {actions && <Group>{actions}</Group>}
    </Group>
  );
}