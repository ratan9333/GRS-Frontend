// "use client";
import { Button, Card, Divider, Grid, Group, Image, Loader, Modal, Select, Stack, Table, Title } from "@mantine/core";
import { IssueStatus } from "@prisma/client";
import { IconArrowBack } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import router from "next/router";
import { useEffect, useState } from "react";
import { GradientBatch, Statusbatch } from "../../../components/Badge";
import { assignIssue, updateStatus } from "../../../components/apiCalls/assignIssue";
import { getOneIssuesData } from "../../../components/apiCalls/fetchOneIssue";
import { useDisclosure } from "@mantine/hooks";

export default function Issue() {
  const params = useParams();
  const issue_id = params?.id as string;
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [assign, setAssign] = useState("");
  const [status, setStatus] = useState("");
  const [loggedUser, setLoggedUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);

  async function fetchData() {
    const res = await getOneIssuesData(issue_id);
    console.log({ res });
    setData(res.data ?? []);
    setUsers(res.users ?? []);
    setIsLoading(false);
  }

  async function assignUser() {
    const res = await assignIssue(issue_id, assign);
    router.reload();
  }

  async function updateIssueStatus() {
    await updateStatus(issue_id, status);
    router.reload();
  }

  async function assignUserToIssue(userData) {
    console.log({ userData });
    const userId = userData.split(":")[0];
    setAssign(userId);
  }

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    const user = JSON.parse(storedData);
    setLoggedUser(user);
    if (!(user as any).name) router.push("/login");
  }, []);

  useEffect(() => {
    console.log({ issue_id });
    if (issue_id) fetchData();
  }, [issue_id]);

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
      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <Loader size="xl" />
        </div>
      )}

      {!isLoading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
          <Card shadow="sm" radius="md" withBorder w={700}>
            <Group grow>
              <Title style={{ fontSize: "30px" }}>Issue Id: {(data as any).id}</Title>
              <div> </div>
              <Statusbatch status={(data as any).status ?? "-"} />
            </Group>
            <Card.Section>
              <Modal opened={opened} onClose={close}>
                <Image
                  src={(data as any).imageUrl ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637"}
                  alt="Norway"
                />
              </Modal>
              <div onClick={open} style={{ cursor: "pointer" }}>
                <Image
                  src={(data as any).imageUrl ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637"}
                  height={400}
                  alt="Norway"
                />
              </div>
            </Card.Section>
            <Stack>
              <div>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Name:</Table.Th>
                      <Table.Th>{(data as any).name ?? "-"}</Table.Th>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Issue:</Table.Th>
                      <Table.Th>{(data as any).issue_type ?? "-"}</Table.Th>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>location:</Table.Th>
                      <Table.Th>{(data as any).location ?? "-"}</Table.Th>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>status:</Table.Th>
                      <Table.Th>{(data as any).status ?? "-"}</Table.Th>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Assigned to:</Table.Th>
                      <Table.Th>{(data as any).userName ?? "-"}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                </Table>
              </div>
              <Divider />
              <Group grow style={{ textAlign: "center" }}>
                {(loggedUser as any)?.role === "ADMIN" && (
                  <Card>
                    <Card.Section>
                      <Select label="Select User to Assign" placeholder="Select User to Assign" data={users.map((x) => x.id + ": " + x.name)} onChange={assignUserToIssue} />
                    </Card.Section>
                    <Button onClick={() => assignUser()}>Assign</Button>
                  </Card>
                )}
                <Card>
                  <Card.Section>
                    <Select label="Change Status" placeholder="Select User to Assign" data={Object.values(IssueStatus)} onChange={setStatus} />
                  </Card.Section>
                  <Button onClick={() => updateIssueStatus()}>Update Status</Button>
                </Card>
              </Group>
            </Stack>
          </Card>
        </div>
      )}
    </>
  );
}
