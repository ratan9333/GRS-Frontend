import { Button, Card, Space, TextInput, Title, rem } from "@mantine/core";
import { IconAt, IconPasswordFingerprint } from "@tabler/icons-react";
import { useStore } from "../../zustand/storage";
import { useState } from "react";
import { userLogin } from "../../components/apiCalls/login";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const icon = <IconAt style={{ width: rem(16), height: rem(16) }} />;
  const iconPassword = <IconPasswordFingerprint style={{ width: rem(16), height: rem(16) }} />;
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { addToUser } = useStore();
  const [throwError, setThrowError] = useState(false);
  const { push } = useRouter();

  async function login() {
    const user = await userLogin(credentials.email, credentials.password);
    console.log("returned ", { user });
    if (!user) setThrowError(true);
    if (user) {
      addToUser(user);
      push("/");
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <Card shadow="sm" radius="md" withBorder w={700}>
        <Title style={{ textAlign: "center" }}>Login </Title>
        <Space h={40} />
        <TextInput
          leftSectionPointerEvents="none"
          leftSection={icon}
          label="Your email"
          placeholder="Your email"
          onChange={(event) => {
            setCredentials({ ...credentials, email: event.currentTarget.value });
          }}
        />
        <TextInput
          mt="md"
          rightSectionPointerEvents="none"
          leftSection={iconPassword}
          label="Password"
          placeholder="Password"
          onChange={(event) => {
            setCredentials({ ...credentials, password: event.currentTarget.value });
          }}
        />
        <Space h={20} />
        <Button fullWidth onClick={login}>
          Login
        </Button>
        {throwError && <p style={{ color: "red", textAlign: "center" }}>Invalid Credentials</p>}
      </Card>
    </div>
  );
}
