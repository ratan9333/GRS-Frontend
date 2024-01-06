import axios from "axios";
import { DELETE_ISSUE_URL } from "./helpers";

export async function deleteIssue(issue_id: any) {
  try {
    const response = await axios.post(DELETE_ISSUE_URL, { issue_id });
    return response.data.response;
  } catch (error) {
    return [];
  }
}
