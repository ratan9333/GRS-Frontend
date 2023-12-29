import axios from "axios";
import { ASSIGN_ISSUE_URL, UPDATE_STATUS_URL } from "./helpers";

export async function assignIssue(issue_id: string, user_id: string) {
  try {
    const response = await axios.post(ASSIGN_ISSUE_URL, {
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
  try {
    const response = await axios.post(UPDATE_STATUS_URL, {
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
