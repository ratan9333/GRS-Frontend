import { Alert, Box, Button, Card, Center, Divider, Grid, Group, PasswordInput, ScrollArea, Select, Space, Stack, Table, Tabs, Text, TextInput, Title } from "@mantine/core";
import { IconArrowBack, IconPasswordFingerprint, IconUserCircle, IconUserPlus, IconUsersGroup } from "@tabler/icons-react";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { assignUserToIssueType } from "../../components/apiCalls/assignUserToIssueType";
import { createUser } from "../../components/apiCalls/createUser";
import { getUsers } from "../../components/apiCalls/getUsers";
import { resetPassword } from "../../components/apiCalls/resetPassword";
import { getAllIssues } from "../../components/apiCalls/getAlIssues";
import { editUser } from "../../components/apiCalls/editUser";
import { deleteUser } from "../../components/apiCalls/deleteUser";

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
  const [issueMappingdata, setIssueMappingdata] = useState([] as any);
  const [editUserId, setEditUserId] = useState({} as any);
  const [editUserInfo, setEditUserInfo] = useState({
    name: "",
    email: "",
    phone_number: "",
  } as any);
  const [editInfoSuccess, setEditInfoSuccess] = useState("");
  const [deleteUserStatus, setDeleteUserStatus] = useState("");

  async function fetchUsers() {
    const res = await getUsers();
    const allIssues = await getAllIssues();
    setIssues(allIssues.issues ?? {});
    setIssueMappingdata(allIssues.issue_mapping ?? {});
    setUsers(res);
  }
  async function handleUserEdit(user) {
    const selected_user_id = user?.target?.value?.split(":")?.[0];
    if (!selected_user_id) return;
    const selected_user_data = users.find((x) => x.id == selected_user_id);
    setEditUserId(selected_user_data);
  }

  async function handleEditUserInfo(key: string, e: any) {
    setEditUserInfo({ ...editUserInfo, [key]: e.target.value });
    console.log({ editUserInfo });
  }

  async function handleDeleteUser() {
    const res = await deleteUser(editUserId.id);
    if (res === "success") {
      setDeleteUserStatus("true");
      setTimeout(() => {
        router.reload();
      }, 5000);
    } else setDeleteUserStatus("false");
  }

  async function handleEditUser() {
    const editedInfo = await editUser({ ...editUserInfo, id: editUserId.id });
    if (editedInfo.id) {
      setEditInfoSuccess("true");
      setEditUserId({ ...editUserId, ...editedInfo });
    } else setEditInfoSuccess("false");
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
        <Grid.Col span={3}>
          <Link href={"/"} style={{ padding: "10px" }}>
            <Button variant="light" color="blue" leftSection={<IconArrowBack />}>
              Back
            </Button>
          </Link>
        </Grid.Col>
      </Grid>
      <Divider />
      {userLoggedIn?.role === "ADMIN" && (
        <div>
          <Card>
            <Tabs defaultValue="assignRole">
              <Tabs.List>
                <Tabs.Tab value="assignRole" leftSection={<IconUsersGroup />}>
                  Assign User
                </Tabs.Tab>
                <Tabs.Tab value="CreateUser" leftSection={<IconUserPlus />}>
                  Create User
                </Tabs.Tab>
                <Tabs.Tab value="resetPassword" leftSection={<IconPasswordFingerprint />}>
                  Reset User Password
                </Tabs.Tab>
                <Tabs.Tab value="EditUser" leftSection={<IconUserCircle />}>
                  Delete / Edit User
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="assignRole">
                <Grid>
                  <Grid.Col span={{ lg: "auto", md: "auto", sm: "auto", xl: "auto", xs: "auto" }}>
                    <Stack>
                      <Space h={20} />
                      <Title order={2}>Assign User to Issue Type</Title>
                      <Select required label="Action" placeholder="Select Action" data={["Assign Issue", "Create Issue"]} onChange={(e) => setCreateIssue(e)} />
                      {createIssue === "Assign Issue" && issues.length === 0 && <Text style={{ color: "red" }}>No issues found. Please create an issue first</Text>}
                      {createIssue === "Assign Issue" && issues.lenght !== 0 && (
                        <Select
                          required
                          label="Issue Type"
                          disabled={issues.length === 0 ? true : false}
                          placeholder="Select Issue Type"
                          data={issues.map((x) => toTitleCase(x))}
                          onChange={setIssueType}
                        />
                      )}
                      {createIssue === "Create Issue" && <TextInput required label="Issue Type" placeholder="Enter Issue Type" onChange={(e) => setIssueType(e.target.value)} />}
                      {users.length === 0 && <Text style={{ color: "red" }}>No users found. Please create a user first</Text>}
                      {createIssue && (
                        <>
                          <Select
                            label="User"
                            placeholder="Select User"
                            disabled={users.length === 0 ? true : false}
                            data={users.map((x) => x.id + ": " + x.name)}
                            onChange={setSelectedUser}
                          />
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
                  </Grid.Col>
                  <Grid.Col span={{ lg: "auto", md: "auto", sm: "auto", xl: "auto", xs: "auto" }}>
                    <Space h={20} />
                    <Title order={2}>{"Issue <> User Mapping"}</Title>
                    <Space h={20} />
                    <IssueMappedTable data={issueMappingdata} />
                  </Grid.Col>
                </Grid>
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
                    <Grid.Col span={3}>
                      <PasswordInput
                        label="Password"
                        placeholder="Enter Password"
                        onChange={(e) => {
                          handleChange("password", e);
                        }}
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={3}>
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
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
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
                  </Card>
                </Stack>
              </Tabs.Panel>
              <Tabs.Panel value="EditUser">
                <Card>
                  <Title order={2}>Delete / Edit User</Title>
                  <Select label="User" placeholder="Select User" data={users.map((x) => x.id + ": " + x.name)} onSelect={handleUserEdit} />
                  <Space h={20} />

                  {editUserId.id && (
                    <>
                      <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group>
                          <Text w="500">
                            Name:{" "}
                            <Text component="span" w="400" fw={700}>
                              {editUserId.name}
                            </Text>
                          </Text>
                          <Text w="500">
                            Email:{" "}
                            <Text component="span" w="400" fw={700}>
                              {editUserId.email}
                            </Text>
                          </Text>
                          <Text w="500">
                            Phone Number:{" "}
                            <Text component="span" w="400" fw={700}>
                              {editUserId.phone_number}
                            </Text>
                          </Text>
                        </Group>
                        <Space h={20} />
                        <Title order={2}>Edit User</Title>
                        <TextInput
                          label="Name"
                          placeholder={editUserId.name}
                          onChange={(e) => {
                            handleEditUserInfo("name", e);
                          }}
                        />
                        <TextInput
                          label="Email"
                          placeholder={editUserId.email}
                          onChange={(e) => {
                            handleEditUserInfo("email", e);
                          }}
                        />
                        <TextInput
                          label="Phone Number"
                          placeholder={editUserId.phone_number}
                          onChange={(e) => {
                            handleEditUserInfo("phone_number", e);
                          }}
                        />
                        <Space h={10} />
                        <Grid grow>
                          <Grid.Col span={6}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                              <Button
                                variant="filled"
                                color="blue"
                                onClick={() => {
                                  handleEditUser();
                                }}
                              >
                                Edit User
                              </Button>
                            </div>
                          </Grid.Col>
                          <Grid.Col span={6}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                              <Button
                                variant="filled"
                                color="red"
                                onClick={() => {
                                  handleDeleteUser();
                                }}
                              >
                                Delete User
                              </Button>
                            </div>
                          </Grid.Col>
                        </Grid>
                        {editInfoSuccess === "true" && (
                          <Alert variant="light" color="green" radius="xs">
                            User Info Edited Successfully
                          </Alert>
                        )}
                        {editInfoSuccess === "false" && (
                          <Alert variant="light" color="red" radius="xs">
                            User Info Edit Failed
                          </Alert>
                        )}
                        {deleteUserStatus === "true" && (
                          <Alert variant="light" color="green" radius="xs">
                            User Deleted Successfully. Reloading Page in 5s...
                          </Alert>
                        )}
                        {deleteUserStatus === "false" && (
                          <Alert variant="light" color="red" radius="xs">
                            User Deletion Failed
                          </Alert>
                        )}
                      </Card>
                    </>
                  )}
                </Card>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </div>
      )}
      {userLoggedIn?.role !== "ADMIN" && (
        // warning
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "30vh" }}>
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
        d="M12 1.37c.955 0 1.845 .437 2.39 1.247l.105 .13l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.333l-.195 .008h-13.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.983l.117 .007l.127 -.007a1 1 0 0 0 0 -1.983l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.983 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"
        stroke-width="0"
        fill="currentColor"
      />
    </svg>
  );
};

function IssueMappedTable({ data }: { data: Record<string, any>[] }) {
  type Row = {
    issue_map_id: "string";
    issue_type: "string";
    user_email: "string";
    user_id: "string";
    user_name: "string";
    user_phone: "string";
  };

  let rows = data.map((row: Row) => (
    <Table.Tr key={row.issue_map_id}>
      <Table.Td>{row.issue_type}</Table.Td>
      {/* <Table.Td>{row.user_id ?? "-"}</Table.Td> */}
      <Table.Td>{row.user_name ?? "-"}</Table.Td>
      <Table.Td>{row.user_phone ?? "-"}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea h={500}>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Issue Type</Table.Th>
            {/* <Table.Th>User Id</Table.Th> */}
            <Table.Th>Nodal Officer Assigned</Table.Th>
            <Table.Th>Nodal Officer 📞</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
