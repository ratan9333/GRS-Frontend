import { Badge, Card, Grid, Stack, Text, Image } from "@mantine/core";
import { GradientBatch } from "./Badge";

type IssueCardProps = {
  issueType: string;
  status: string;
  assigned: boolean;
  id: string;
};

export function IssueCard({ issueType, status, assigned, id }: IssueCardProps) {
  const color = status === "open" ? "blue" : "red";
  return (
    <Card shadow="sm" radius="md" withBorder>
      <Stack>
        <Card.Section>
          <Image src="https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" height={160} alt="Norway" />
        </Card.Section>
        <Grid justify="space-between">
          <GradientBatch assigned={assigned} />
          <Badge color="blue" size="sm">
            {status}
          </Badge>
        </Grid>
        <div style={{ textAlign: "left" }}>
          <Text fw={700}>{`Issue Type: ${issueType}`}</Text>
          <Text fw={700}>{`Issue Id: ${id}`}</Text>
        </div>
      </Stack>
    </Card>
  );
}
