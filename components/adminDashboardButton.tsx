import { Button } from "@mantine/core";
import router from "next/router";

export function AdminDashboardButton() {
  function pushToAdminDashboard() {
    router.push("/admin_home");
  }
  return (
    <Button variant="light" color="blue" size="sm" onClick={pushToAdminDashboard}>
      Admin Dashboard
    </Button>
  );
}
