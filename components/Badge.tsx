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

export function Statusbatch({ status }: { status: string }) {
  // OPEN
  // ASSIGNED
  // REVIEWED
  // CLOSED
  // REJECTED
  // console.log({ status });
  let color;
  switch (status.toUpperCase()) {
    case "OPEN":
      color = "blue";
      break;
    case "ASSIGNED":
      color = "cyan";
      break;
    case "REVIEWED":
      color = "lime";
      break;
    case "CLOSED":
      color = "green";
      break;
    case "REJECTED":
      color = "red";
      break;
    default:
      color = "blue";
      break;
  }
  return (
    <Badge color={color} size="sm">
      {status}
    </Badge>
  );
}
