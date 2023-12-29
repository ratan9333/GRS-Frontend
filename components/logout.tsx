import { Button } from "@mantine/core";

export function LogOut() {
  function logout() {
    localStorage.removeItem("userData");
    window.location.reload();
  }
  return (
    <Button variant="light" color="red" size="compact-sm" onClick={logout}>
      Log Out
    </Button>
  );
}
