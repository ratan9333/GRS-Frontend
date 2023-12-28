import { Button, Card, PasswordInput, Space, TextInput, Title, rem } from "@mantine/core";
import { IconAt, IconPasswordFingerprint } from "@tabler/icons-react";
import { useStore } from "../../zustand/storage";
import { useEffect, useState } from "react";
import { userLogin } from "../../components/apiCalls/login";
import { useRouter } from "next/navigation";
import router from "next/router";

export default function LoginPage() {
  const icon = <IconAt style={{ width: rem(22), height: rem(22) }} />;
  const iconPassword = <IconPasswordFingerprint style={{ width: rem(22), height: rem(22) }} />;
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  // const { addToUser } = useStore();
  const [throwError, setThrowError] = useState(false);
  const { push } = useRouter();

  async function login() {
    const user = await userLogin(credentials.email, credentials.password);
    if (!user) setThrowError(true);
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
      push("/");
    }
  }

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    const user = JSON.parse(storedData);
    console.log({ userhome: user });
    if ((user as any)?.name) router.push("/");
  }, []);

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
        <PasswordInput
          mt="md"
          leftSection={iconPassword}
          label="Password"
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
