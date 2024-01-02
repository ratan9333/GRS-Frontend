import { Alert, Button, Card, Center, Divider, Grid, Group, PasswordInput, Select, Space, Stack, Tabs, Text, TextInput, Title } from "@mantine/core";
import { IconArrowBack, IconPasswordFingerprint, IconUserPlus, IconUsersGroup } from "@tabler/icons-react";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { assignUserToIssueType } from "../../components/apiCalls/assignUserToIssueType";
import { createUser } from "../../components/apiCalls/createUser";
import { getUsers } from "../../components/apiCalls/getUsers";
import { resetPassword } from "../../components/apiCalls/resetPassword";
import { getAllIssues } from "../../components/apiCalls/getAlIssues";

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase().replace(/_/g, " ");
  });
}

export default function AdminHome() {
  const [userLoggedIn, setuserLoggedIn] = useState({} as any);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
    role: "",
  });
  const [resetPasswordFormData, setResetPasswordFormData] = useState({
    user_id: "",
    password: "",
    confirm_password: "",
  });

  const [users, setUsers] = useState([]);
  const [issueType, setIssueType] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState({ color: "red", message: "" });
  const [createUserMessage, setcreateUserMessage] = useState({ color: "red", message: "" });
  const [resetPasswordMessage, setResetPasswordMessage] = useState({ color: "red", message: "" });
  const [createIssue, setCreateIssue] = useState("");
  const [issues, setIssues] = useState([] as any);

  async function fetchUsers() {
    const res = await getUsers();
    const allIssues = await getAllIssues();
    setIssues(allIssues);
    setUsers(res);
  }

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    const user = JSON.parse(storedData);
    setuserLoggedIn(user);
    fetchUsers();
  }, []);

  async function assignUserToIssue() {
    setMessage({ color: "red", message: "" });
    if (!selectedUser || !issueType) {
      setMessage({ color: "red", message: "Please select user and issue type" });
    } else {
      const user_id = selectedUser.split(":")[0];
      console.log({ user_id, issueType });
      if (!user_id || !issueType) setMessage({ color: "red", message: "Please select user and issue type" });
      else {
        await assignUserToIssueType(issueType, user_id);
        setMessage({ color: "green", message: "User assigned to issue type" });
      }
    }
  }
  async function handleResetPassword() {
    if (resetPasswordFormData.password !== resetPasswordFormData.confirm_password) {
      setResetPasswordMessage({ color: "red", message: "Passwords do not match" });
      return;
    }
    const res = await resetPassword(resetPasswordFormData.user_id, resetPasswordFormData.password);
    if (res.error) setResetPasswordMessage({ color: "red", message: res.error });
    else {
      setResetPasswordMessage({ color: "green", message: "Password reset successful" });
    }
  }

  async function createUserCheck() {
    for (const key in formData) {
      if (!formData[key]) {
        setcreateUserMessage({ color: "red", message: `Please enter ${key}` });
        return;
      }
    }
    if (formData.password !== formData.confirm_password) {
      setcreateUserMessage({ color: "red", message: "Passwords do not match" });
      return;
    }
    const user = await createUser(formData);
    if (user.error) setcreateUserMessage({ color: "red", message: user.error });
    else {
      setcreateUserMessage({ color: "green", message: "User created. Reloading in 5s..." });
      setTimeout(() => {
        router.reload();
      }, 5000);
    }
  }

  function handleChange(key: string, e: any) {
    if (key === "role") setFormData({ ...formData, [key]: e });
    else setFormData({ ...formData, [key]: e.target.value });
  }

  return (
    <>
      <Grid grow>
        <Grid.Col span={6}>
          <Link href={"/"} style={{ padding: "10px" }}>
            <Button variant="light" color="blue" leftSection={<IconArrowBack />}>
              Back
            </Button>
          </Link>
        </Grid.Col>
      </Grid>
      <Divider />
      {userLoggedIn?.role === "ADMIN" && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Card shadow="sm" radius="md" withBorder w={200} style={{ minWidth: "800px", minHeight: "600px" }}>
            <Tabs defaultValue="assignRole">
              <Tabs.List>
                <Tabs.Tab value="assignRole" leftSection={<IconUsersGroup />}>
                  Assign User
                </Tabs.Tab>
                <Tabs.Tab value="CreateUser" leftSection={<IconUserPlus />}>
                  Create User
                </Tabs.Tab>
                <Tabs.Tab value="resetPassword" leftSection={<IconPasswordFingerprint />}>
                  Reset Password
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="assignRole">
                <Center>
                  <Stack>
                    <Space h={20} />
                    <Title order={2}>Assign User to Issue Type</Title>
                    <Select required label="Action" placeholder="Select Action" data={["Assign Issue", "Create Issue"]} onChange={(e) => setCreateIssue(e)} />
                    {createIssue === "Assign Issue" && (
                      <Select required label="Issue Type" placeholder="Select Issue Type" data={issues.map((x) => toTitleCase(x))} onChange={setIssueType} />
                    )}
                    {createIssue === "Create Issue" && <TextInput required label="Issue Type" placeholder="Enter Issue Type" onChange={(e) => setIssueType(e.target.value)} />}
                    {createIssue && (
                      <>
                        <Select label="User" placeholder="Select User" data={users.map((x) => x.id + ": " + x.name)} onChange={setSelectedUser} />
                        <Button
                          variant="filled"
                          color="blue"
                          onClick={() => {
                            assignUserToIssue();
                          }}
                        >
                          Assign
                        </Button>
                      </>
                    )}
                    {message.message && (
                      <div>
                        <Space h={20} />
                        <Alert variant="light" color={message.color} radius="xs">
                          {message.message}
                        </Alert>
                      </div>
                    )}
                  </Stack>
                </Center>
              </Tabs.Panel>
              <Tabs.Panel value="CreateUser">
                {/* <Center>  */}
                <Stack>
                  {createUserMessage.message && (
                    <div>
                      <Space h={20} />
                      <Alert variant="light" color={createUserMessage.color} radius="xs" withCloseButton>
                        {toTitleCase(createUserMessage.message)}
                      </Alert>
                    </div>
                  )}
                  {!createUserMessage.message && <Space h={20} />}
                  <Title order={2}>Create User</Title>
                  <TextInput
                    label="Name"
                    placeholder="Enter Name"
                    onChange={(e) => {
                      handleChange("name", e);
                    }}
                    required
                  />
                  <TextInput
                    label="Email"
                    placeholder="Enter Email"
                    onChange={(e) => {
                      handleChange("email", e);
                    }}
                    required
                  />
                  <TextInput
                    label="Phone Number"
                    placeholder="Enter Phone Number"
                    onChange={(e) => {
                      handleChange("phone_number", e);
                    }}
                    required
                  />
                  <Grid>
                    <Grid.Col span={6}>
                      <PasswordInput
                        label="Password"
                        placeholder="Enter Password"
                        onChange={(e) => {
                          handleChange("password", e);
                        }}
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        onChange={(e) => {
                          handleChange("confirm_password", e);
                        }}
                        required
                      />
                    </Grid.Col>
                  </Grid>
                  <Select
                    label="Role"
                    placeholder="Select User"
                    data={["ADMIN", "USER"]}
                    onChange={(e) => {
                      handleChange("role", e);
                    }}
                    required
                  />
                  <Button
                    variant="light"
                    color="blue"
                    onClick={() => {
                      createUserCheck();
                    }}
                  >
                    Create User
                  </Button>
                </Stack>
                {/* </Center> */}
              </Tabs.Panel>
              <Tabs.Panel value="resetPassword">
                <Center>
                  <Stack>
                    {resetPasswordMessage.message && (
                      <div>
                        <Space h={20} />
                        <Alert variant="light" color={resetPasswordMessage.color} radius="xs" withCloseButton>
                          {toTitleCase(resetPasswordMessage.message)}
                        </Alert>
                      </div>
                    )}
                    {!resetPasswordMessage.message && <Space h={20} />}
                    <Title order={2}>Reset Password</Title>
                    <Select
                      label="User"
                      placeholder="Select User"
                      data={users.map((x) => x.id + ": " + x.name)}
                      onChange={(e) => {
                        resetPasswordFormData.user_id = e?.split(":")?.[0];
                      }}
                    />
                    <PasswordInput label="Password" placeholder="Enter Password" onChange={(e) => (resetPasswordFormData.password = e.target.value)} />
                    <PasswordInput
                      label="Confirm Password"
                      placeholder="Confirm Password"
                      onChange={(e) => {
                        resetPasswordFormData.confirm_password = e.target.value;
                      }}
                    />
                    <Button
                      variant="filled"
                      color="blue"
                      onClick={() => {
                        handleResetPassword();
                      }}
                    >
                      Reset Password
                    </Button>
                  </Stack>
                </Center>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </div>
      )}
      {userLoggedIn?.role !== "ADMIN" && (
        // warning
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <Stack>
            <AlertIcon />
            <Text fw={700}>Not Authorized</Text>
            <Button variant="light" color="indigo" onClick={() => router.push("/")}>
              Back Home
            </Button>
          </Stack>
        </div>
      )}
    </>
  );
}

const AlertIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#ffec00"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"
        stroke-width="0"
        fill="currentColor"
      />
    </svg>
  );
};
