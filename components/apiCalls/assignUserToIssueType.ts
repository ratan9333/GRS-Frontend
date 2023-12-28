import axios from "axios";
import { URL } from "./getIssues";

export async function assignUserToIssueType(issue_type: string, user_id: number | string) {
  const url = URL + "/assign_user";
  try {
    const response = await axios.post(url, {
      issue_type,
      user_id,
    });
    return response.data.response;
  } catch (error) {
    console.log({ error });
    return [];
  }
}
