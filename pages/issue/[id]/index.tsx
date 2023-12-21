// "use client";
import { Button, Card, Divider, Grid, Group, Image, Select, Stack, Text } from "@mantine/core";
import { useParams } from "next/navigation";
import router from "next/router";
import { useEffect, useState } from "react";
import { assignIssue, updateStatus } from "../../../components/apiCalls/assignIssue";
import { getOneIssuesData } from "../../../components/apiCalls/fetchOneIssue";
import { IssueStatus } from "@prisma/client";
import { useStore } from "../../../zustand/storage";

export default function Issue() {
  const params = useParams();
  const issue_id = params?.id as string;
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [assign, setAssign] = useState("");
  const [status, setStatus] = useState("");
  const { user } = useStore();
  async function fetchData() {
    const res = await getOneIssuesData(issue_id);
    setData(res.data ?? []);
    setUsers(res.users ?? []);
  }

  async function assignUser() {
    console.log({ assign, issue_id });
    const res = await assignIssue(issue_id, assign);
    // console.log("assigned data: ", res);
    router.reload();
  }

  async function updateIssueStatus() {
    console.log({ assign, issue_id });
    await updateStatus(issue_id, status);
    router.reload();
  }

  useEffect(() => {
    fetchData();
  }, [issue_id]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
      <Card shadow="sm" radius="md" withBorder w={700}>
        <Card.Section>
          <Image src="https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" height={400} alt="Norway" />
        </Card.Section>
        <Stack>
          <div>
            <Stack>
              <Text fw={700} key={"name"}>
                Name: {(data as any).name ?? "-"}
              </Text>
              <Text fw={700} key={"Issue"}>
                Issue: {(data as any).issue_type ?? "-"}
              </Text>
              <Text fw={700} key={"location"}>
                location: {(data as any).location ?? "-"}
              </Text>
              <Text fw={700} key={"status"}>
                status: {(data as any).status ?? "-"}
              </Text>
              <Text fw={700} key={"Assigned"}>
                Assigned to: {(data as any).assigned_to ?? "-"}
              </Text>
            </Stack>
          </div>
          <Divider />
          <Group grow style={{ textAlign: "center" }}>
            <Card>
              <Card.Section>
                <Select label="Select User to Assign" placeholder="Select User to Assign" data={users.map((x) => x.name)} onChange={setAssign} />
              </Card.Section>
              <Button onClick={() => assignUser()}>Assign</Button>
            </Card>
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
  );
}
