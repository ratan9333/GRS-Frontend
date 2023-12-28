import axios from "axios";
import { URL } from "./getIssues";

export async function getUsers() {
  const url = URL + "/users";
  try {
    const response = await axios.get(url, {});
    return response.data.data;
  } catch (error) {
    console.log({ error });
    return [];
  }
}
