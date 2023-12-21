import { Badge } from "@mantine/core";

type AssignedBatchProps = {
  assigned?: boolean;
};

export function GradientBatch({ assigned }: AssignedBatchProps) {
  if (assigned)
    return (
      <Badge size="md" variant="gradient" gradient={{ from: "teal", to: "lime", deg: 0 }}>
        Assigned
      </Badge>
    );
  return (
    <Badge size="md" variant="gradient" gradient={{ from: "red", to: "pink", deg: 0 }}>
      Not Assigned
    </Badge>
  );
}
