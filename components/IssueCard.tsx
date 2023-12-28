import { Badge, Card, Grid, Stack, Text, Image } from "@mantine/core";
import { GradientBatch, Statusbatch } from "./Badge";

type IssueCardProps = {
  issueType: string;
  status: string;
  assigned: boolean;
  id: string;
  imageUrl: string;
};

export function IssueCard({ issueType, status, assigned, id, imageUrl }: IssueCardProps) {
  const image_url = imageUrl ?? "https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  return (
    <Card shadow="sm" radius="md" withBorder>
      <Stack>
        <Card.Section>
          <Image src={image_url} height={160} alt="Norway" />
        </Card.Section>
        <Grid justify="space-between">
          <GradientBatch assigned={assigned} />
          <Statusbatch status={status} />

          {/* <Badge color="blue" size="sm">
            {status}
          </Badge> */}
        </Grid>
        <div style={{ textAlign: "left" }}>
          <Text fw={700}>{`Issue Type: ${issueType}`}</Text>
          <Text fw={700}>{`Issue Id: ${id}`}</Text>
        </div>
      </Stack>
    </Card>
  );
}
