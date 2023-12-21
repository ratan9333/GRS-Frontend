import { Button, Group, useMantineColorScheme } from "@mantine/core";
import { Icon123, IconMoon, IconSun } from "@tabler/icons-react";

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Group justify="right" mt="xs">
      <Button variant="transparent" radius={100} onClick={() => setColorScheme("light")}>
        <IconSun />
      </Button>
      <Button variant="transparent" radius={100} onClick={() => setColorScheme("dark")}>
        <IconMoon />
      </Button>
    </Group>
  );
}
