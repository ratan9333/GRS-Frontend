import { Grid, MultiSelect, Select, Stack, Title } from "@mantine/core";
import styles from "./Home.module.css";
import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import { GradientBatch } from "../Badge";
import { IssueCard } from "../IssueCard";
import Link from "next/link";
import { getIssues } from "../apiCalls/getIssues";
import { useEffect, useState } from "react";
import { get } from "http";
import { IssueStatus } from "@prisma/client";
import TableComponent from "../tableComponent/table";

export const Home = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");

  async function fetchData() {
    const res = await getIssues(filter === "All" ? null : filter);
    console.log({ res });
    setData(res ?? []);
  }

  useEffect(() => {
    fetchData();
  }, [filter]);

  return (
    <>
      <Grid>
        <Grid.Col span={6}>
          {" "}
          <text style={{ fontSize: "30px" }}>Issues</text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Select label="Filter" placeholder={filter} data={[...["All"], ...Object.values(IssueStatus)]} onChange={setFilter} />
        </Grid.Col>
      </Grid>
      {data.length === 0 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <Card shadow="sm" radius="md" withBorder w={700} style={{ textAlign: "center" }}>
            No Issues
          </Card>
        </div>
      )}
      <Grid gutter={25}>
        {data.length > 0 &&
          data.map((item, index) => (
            <Grid.Col span={3}>
              <Link href={`/issue/${item.id}`} style={{ textDecoration: "none" }}>
                <IssueCard key={index} status={item.status} issueType={item.issueType} assigned={item.assigned} id={item.id} />
              </Link>
            </Grid.Col>
          ))}
      </Grid>
    </>
  );
};
