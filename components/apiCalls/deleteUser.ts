import axios from "axios";
import { DELETE_USER_URL } from "./helpers";

export async function deleteUser(user_id: any) {
  try {
    const response = await axios.post(DELETE_USER_URL, { user_id });
    return response.data.response;
  } catch (error) {
    return [];
  }
}
