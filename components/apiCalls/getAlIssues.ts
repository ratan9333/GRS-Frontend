import axios from "axios";
import { GET_ALL_ISSUES_URL } from "./helpers";

export async function getAllIssues() {
  try {
    const response = await axios.get(GET_ALL_ISSUES_URL, {});
    return response.data.response;
  } catch (error) {
    console.log({ error });
    return {};
  }
}
