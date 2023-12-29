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
    <Card shadow="sm" radius="md" withBorder style={{ minHeight: "190px" }}>
      <Card.Section>
        <Image src={image_url} height={160} alt="Norway" />
      </Card.Section>
      <Stack>
        <Grid justify="space-between">
          <Statusbatch status={status} />
        </Grid>
        <div style={{ textAlign: "left" }}>
          <Text fw={700} size="14px">{`Issue Type: ${issueType}`}</Text>
          <Text fw={700} size="14px">{`Issue Id: ${id}`}</Text>
        </div>
      </Stack>
    </Card>
  );
}
