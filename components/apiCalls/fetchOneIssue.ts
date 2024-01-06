import axios from "axios";
import { GET_ONE_SIIUE_URL } from "./helpers";

export async function getOneIssuesData(id: string) {
  try {
    const response = await axios.get(`${GET_ONE_SIIUE_URL}/${id}`, {});
    return response.data.response;
  } catch (error) {
    console.log({ error });
    return {};
  }
}
