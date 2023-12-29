import axios from "axios";
import { RESET_PASSWORD_URL } from "./helpers";

export async function resetPassword(user_id: string, password: number | string) {
  try {
    const response = await axios.post(RESET_PASSWORD_URL, {
      user_id,
      password,
    });
    return response.data;
  } catch (error) {
    console.log({ error });
    return [];
  }
}
