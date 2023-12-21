import axios from "axios";
import { URL } from "./getIssues";

export async function assignIssue(issue_id: string, user_id: string) {
  const url = URL + "/assignIssue";
  try {
    const response = await axios.post(url, {
      issue_id,
      user_id,
    });
    console.log({ responsed: response.data.response });
    return response.data.response;
  } catch (error) {
    console.log({ error });
    return {};
  }
}

export async function updateStatus(issue_id: string, status: string) {
  const url = URL + "/updateStatus";
  console.log("updateStatus: ", { issue_id, status });
  try {
    const response = await axios.post(url, {
      issue_id,
      status,
    });
    console.log({ responsed: response.data.response });
    return response.data.response;
  } catch (error) {
    console.log({ error });
    return {};
  }
}
