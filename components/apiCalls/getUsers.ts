import axios from "axios";
import { GET_ALL_USERS } from "./helpers";

export async function getUsers() {
  try {
    const response = await axios.get(GET_ALL_USERS, {});
    console.log({ response });
    return response.data.data;
  } catch (error) {
    console.log({ error });
    return [];
  }
}
