import axios from "axios";
import { LOGIN_URL } from "./helpers";

export async function userLogin(email, password: string) {
  console.log({ LOGIN_URL });
  try {
    const response = await axios.post(LOGIN_URL, { email, password });
    const user = response.data.response;
    if (!user) return null;
    return user;
  } catch (error) {
    return null;
  }
}
