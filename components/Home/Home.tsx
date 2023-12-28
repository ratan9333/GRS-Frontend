import { Card, Divider, Grid, Group, Loader, Pagination, Select, Title } from "@mantine/core";
import { IssueStatus } from "@prisma/client";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { IssueCard } from "../IssueCard";
import { AdminDashboardButton } from "../adminDashboardButton";
import { getIssues } from "../apiCalls/getIssues";
import { LogOut } from "../logout";

export const Home = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("All");
  const [pagesCount, setPagesCount] = useState(1);
  const [page, setPage] = useState(1);
  const [adminUser, setAdminUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData(userId) {
    const res = await getIssues(status, page, userId);
    setData(res.data ?? []);
    setPagesCount(res.count ?? 1);
    setIsLoading(false);
  }

  async function setNewPage(page) {
    console.log("setting page");
    setData([]);
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
    setData([]);
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
              <Title order={1} fw={400}>
                Logged in as:{" "}
              </Title>
              <Title order={1} style={{ color: "rgb(75,155,235)" }}>
                {(adminUser as any)?.name ?? "No Name"}
              </Title>
            </Group>

            {/* <Title order={2}>Logged in as: {(adminUser as any)?.name ?? "No Name"}</Title> */}
            <Group style={{ marginBottom: "10px" }}>
              <LogOut />
              <AdminDashboardButton />
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Filter"
              style={{ maxWidth: "300px", float: "right" }}
              maxDropdownHeight={300}
              placeholder={status}
              data={[...["All"], ...Object.values(IssueStatus)]}
              onChange={setStatus}
            />
          </Grid.Col>
          {/* <Grid.Col span={1}>
          </Grid.Col> */}
        </Grid>
        <Divider style={{ margin: "5px" }} />
        {data.length === 0 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
            {isLoading && <Loader size="xl" />}
            {!isLoading && (
              <Card shadow="sm" radius="md" withBorder w={700} style={{ textAlign: "center" }}>
                No Issues
              </Card>
            )}
          </div>
        )}
        <Grid gutter={"xs"}>
          {data.length > 0 &&
            data.map((item, index) => (
              <Grid.Col span={{ lg: 3, md: 4, sm: 4, xl: 3, xs: 6 }} key={index}>
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
          <Grid.Col span={9} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Pagination total={pagesCount % 8 === 0 ? pagesCount / 8 : pagesCount / 8 + 1} siblings={1} defaultValue={1} onChange={setNewPage} />
          </Grid.Col>
        </Grid>
      </div>
    </>
  );
};
