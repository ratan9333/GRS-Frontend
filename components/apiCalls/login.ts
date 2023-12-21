import axios from "axios";
import { URL } from "./getIssues";

export async function userLogin(email, password: string) {
  const url = URL + "/login";
  try {
    const response = await axios.post(url, { email, password });
    const user = response.data.response;
    console.log({ user, exist: user });
    if (!user) return null;
    return user;
  } catch (error) {
    console.log({ error });
    return null;
  }
}
