import { Button, Group, useMantineColorScheme } from "@mantine/core";
import { Icon123, IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const [variant, setVariant] = useState("light");

  useEffect(() => {
    setColorScheme(variant as any);
  }, [variant]);

  return (
    <Group justify="right" mt="xs">
      <Button variant="transparent" radius={100} onClick={() => setVariant(variant === "dark" ? "light" : "dark")}>
        {variant === "dark" ? <IconSun /> : <IconMoon />}
      </Button>
    </Group>
  );
}
