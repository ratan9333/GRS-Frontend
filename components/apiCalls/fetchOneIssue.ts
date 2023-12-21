import axios from "axios";
import { URL } from "./getIssues";

export async function getOneIssuesData(id: string) {
  const url = URL + "/issues/" + id;
  try {
    const response = await axios.get(url, {});
    return response.data.response;
  } catch (error) {
    console.log({ error });
    return {};
  }
}
