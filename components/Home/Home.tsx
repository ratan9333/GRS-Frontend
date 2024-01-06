import { Button, Card, Divider, Grid, Group, Loader, Pagination, Select, Switch, Table, Title } from "@mantine/core";
import { IssueStatus } from "@prisma/client";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { IssueCard } from "../IssueCard";
import { AdminDashboardButton } from "../adminDashboardButton";
import { getIssues } from "../apiCalls/getIssues";
import { LogOut } from "../logout";

export const Home = () => {
  const [allIssueData, setAllIssueData] = useState([]);
  const [status, setStatus] = useState("All");
  const [pagesCount, setPagesCount] = useState(1);
  const [page, setPage] = useState(1);
  const [adminUser, setAdminUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [displayTable, setDisplayTable] = useState(true);

  async function fetchData(userId) {
    const res = await getIssues(status, page, userId);
    setAllIssueData(res.data ?? []);
    setPagesCount(res.count ?? 1);
    setIsLoading(false);
  }

  async function setNewPage(page) {
    console.log("setting page");
    setAllIssueData([]);
    setIsLoading(true);
    setPage(page);
  }

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    const user = JSON.parse(storedData);
    setAdminUser(user);
    if (!(user as any)?.name) router.push("/login");
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    const user = JSON.parse(storedData);
    setAllIssueData([]);
    setIsLoading(true);
    console.log("fetching.....");
    fetchData(user?.role === "USER" ? user.id : null);
  }, [status, page]);

  return (
    <>
      <div>
        <Grid>
          <Grid.Col span={6}>
            <Group style={{ marginBottom: "10px" }}>
              <Title order={1} fw={400} size={"20px"}>
                Logged in as:{" "}
              </Title>
              <Title size={"20px"} order={1} style={{ color: "rgb(75,155,235)" }}>
                {(adminUser as any)?.name ?? "No Name"}
              </Title>
            </Group>

            <Group style={{ marginBottom: "10px" }}>
              <LogOut />
              {(adminUser as any)?.role === "ADMIN" && <AdminDashboardButton />}
            </Group>
          </Grid.Col>

          <Grid.Col span={6}>
            <Select
              label="Filter"
              style={{ maxWidth: "300px", color: "red", float: "right" }}
              maxDropdownHeight={300}
              placeholder={status}
              data={[...["All"], ...Object.values(IssueStatus)]}
              onChange={setStatus}
            />
          </Grid.Col>
        </Grid>
        <Divider style={{ margin: "5px" }} />

        {allIssueData.length === 0 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
            {isLoading && <Loader size="xl" />}
            {!isLoading && (
              <Card shadow="sm" radius="md" withBorder w={700} style={{ textAlign: "center" }}>
                No Issues
              </Card>
            )}
          </div>
        )}
        {!isLoading && (
          <Switch defaultChecked style={{ float: "right" }} labelPosition="left" label="View Table" size="sm" onChange={(event) => setDisplayTable(event.currentTarget.checked)} />
        )}
        <Grid gutter="xs">
          {allIssueData.length > 0 && displayTable && <TableComponent data={allIssueData} />}
          {allIssueData.length > 0 &&
            !displayTable &&
            allIssueData.map((item, index) => (
              <Grid.Col span={{ lg: 3, md: 3, sm: 4, xl: 3, xs: 6 }} key={index}>
                <Link key={index} href={`/issue/${item.id}`} style={{ textDecoration: "none" }}>
                  <IssueCard key={index} status={item.status} issueType={item.issueType} assigned={item.assigned} imageUrl={item.imageUrl} id={item.id} />
                </Link>
              </Grid.Col>
            ))}
        </Grid>
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", padding: "10px", textAlign: "center", zIndex: 100, backgroundColor: "white" }}>
        <Divider />
        <Grid grow>
          {/* <Grid.Col span={1} offset={11}> */}
          {/* </Grid.Col> */}
          <Grid.Col span={12} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Pagination total={pagesCount % 8 === 0 ? pagesCount / 8 : pagesCount / 8 + 1} siblings={1} defaultValue={1} onChange={setNewPage} />
          </Grid.Col>
        </Grid>
      </div>
    </>
  );
};

function TableComponent({ data }: { data: Record<string, any>[] }) {
  const elements = data.map((element) => ({
    issue_id: element.id,
    issue_type: element.issueType,
    status: element.status,
  }));

  //[{ issue_type: 6, issue_id: 12.011, status: "C" }];

  const rows = elements.map((element) => (
    <Table.Tr key={element.issue_id}>
      <Table.Td></Table.Td>
      <Table.Td>{element.issue_id}</Table.Td>
      <Table.Td>{element.issue_type}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
      <Table.Td>
        <Button
          size="xs"
          variant="outline"
          color="blue"
          onClick={() => {
            router.push(`/issue/${element.issue_id}`);
          }}
        >
          View Issue
        </Button>
      </Table.Td>
      {/* <Table.Td>{element.mass}</Table.Td> */}
    </Table.Tr>
  ));

  return (
    <Table striped highlightOnHover withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th></Table.Th>
          <Table.Th>Issue Id</Table.Th>
          <Table.Th>Issue Type</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
