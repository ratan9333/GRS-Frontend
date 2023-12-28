import axios from "axios";
import { URL } from "./getIssues";

type userDataType = {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  role: string;
};

export async function createUser(data: userDataType) {
  const url = URL + "/create_user";
  try {
    const response = await axios.post(url, data);
    return response.data.response;
  } catch (error) {
    console.log({ error });
    return [];
  }
}
