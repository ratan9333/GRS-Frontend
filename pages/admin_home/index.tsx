import { Button, Card, Divider, Group, Select, Stack, Table, Text, Title, Image, Tabs, Center, TextInput, Space, Grid, Alert, PasswordInput } from "@mantine/core";
import { IssueStatus } from "@prisma/client";
import router from "next/router";
import { useEffect, useState } from "react";
import { GradientBatch } from "../../components/Badge";
import { IconPhoto, IconMessageCircle, IconSettings, IconUser, IconUserPlus, IconUsersGroup, IconInfoCircle, IconArrowBack } from "@tabler/icons-react";
import { getUsers } from "../../components/apiCalls/getUsers";
import { assignUserToIssueType } from "../../components/apiCalls/assignUserToIssueType";
import { createUser } from "../../components/apiCalls/createUser";
import Link from "next/link";

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
  const [users, setUsers] = useState([]);
  const [issueType, setIssueType] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState({ color: "red", message: "" });
  const [createUserMessage, setcreateUserMessage] = useState({ color: "red", message: "" });

  async function fetchUsers() {
    const res = await getUsers();
    console.log({ res });
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
    const user_id = selectedUser.split(":")[0];
    console.log({ user_id, issueType });
    if (!user_id || !issueType) setMessage({ color: "red", message: "Please select user and issue type" });
    else {
      await assignUserToIssueType(issueType, user_id);
      setMessage({ color: "green", message: "User assigned to issue type" });
    }
  }

  async function createUserCheck() {
    console.log({ formData });
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
    await createUser(formData);
    setcreateUserMessage({ color: "green", message: "User created" });
  }

  function handleChange(key: string, e: any) {
    if (key === "role") setFormData({ ...formData, [key]: e });
    else setFormData({ ...formData, [key]: e.target.value });
  }

  const IssueType = ["ILLEGAL_CONSTRUCTION", "ILLEGAL_TRANSAPORTATION", "GARBAGE_IN_PUBLIC_PLACE", "ILLEGAL_PARKING_OF_VEHICLE", "TRAFFIC", "DAMAGED_PUBLIC_INFRASRUCTURE"];

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
          <Card shadow="sm" radius="md" withBorder w={200} style={{ minWidth: "400px", minHeight: "600px" }}>
            <Tabs defaultValue="assignRole">
              <Tabs.List>
                <Tabs.Tab value="assignRole" leftSection={<IconUsersGroup />}>
                  Assign User
                </Tabs.Tab>
                <Tabs.Tab value="CreateUser" leftSection={<IconUserPlus />}>
                  Create User
                </Tabs.Tab>
                {/* <Tabs.Tab value="CreateIssue" leftSection={<IconUserPlus />}>
                  Create Issue
                </Tabs.Tab> */}
              </Tabs.List>

              <Tabs.Panel value="assignRole">
                <Center>
                  <Stack>
                    <Space h={20} />
                    <Title order={2}>Assign User to Issue Type</Title>
                    <Select label="User" placeholder="Select User" data={users.map((x) => x.id + ": " + x.name)} onChange={setSelectedUser} />
                    <Select label="Issue Type" placeholder="Select Issue Type" data={IssueType.map((x) => toTitleCase(x))} onChange={setIssueType} />
                    <Button
                      variant="filled"
                      color="blue"
                      onClick={() => {
                        assignUserToIssue();
                      }}
                    >
                      Assign
                    </Button>
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
                  <Space h={20} />
                  <Title order={2}>Create User</Title>
                  <TextInput
                    label="Name"
                    placeholder="Enter Name"
                    onChange={(e) => {
                      handleChange("name", e);
                    }}
                  />
                  <TextInput
                    label="Email"
                    placeholder="Enter Email"
                    onChange={(e) => {
                      handleChange("email", e);
                    }}
                  />
                  <TextInput
                    label="Phone Number"
                    placeholder="Enter Phone Number"
                    onChange={(e) => {
                      handleChange("phone_number", e);
                    }}
                  />
                  <Grid>
                    {/* <TextInput */}
                    <PasswordInput
                      label="Password"
                      placeholder="Enter Password"
                      w={175}
                      onChange={(e) => {
                        handleChange("password", e);
                      }}
                    />
                    {/* <TextInput */}
                    <PasswordInput
                      label="Confirm Password"
                      placeholder="Confirm Password"
                      w={175}
                      onChange={(e) => {
                        handleChange("confirm_password", e);
                      }}
                    />
                  </Grid>

                  <Select
                    label="Role"
                    placeholder="Select User"
                    data={["ADMIN", "USER"]}
                    onChange={(e) => {
                      handleChange("role", e);
                    }}
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
                  {createUserMessage.message && (
                    <div>
                      <Space h={20} />
                      <Alert variant="light" color={createUserMessage.color} radius="xs" withCloseButton>
                        {toTitleCase(createUserMessage.message)}
                      </Alert>
                    </div>
                  )}
                </Stack>
                {/* </Center> */}
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
