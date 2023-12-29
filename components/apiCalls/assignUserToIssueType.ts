import axios from "axios";
import { ASSIGN_USER_TO_ISSUE_TYPE_URL } from "./helpers";

export async function assignUserToIssueType(issue_type: string, user_id: number | string) {
  try {
    const response = await axios.post(ASSIGN_USER_TO_ISSUE_TYPE_URL, {
      issue_type,
      user_id,
    });
    return response.data.response;
  } catch (error) {
    console.log({ error });
    return [];
  }
}
