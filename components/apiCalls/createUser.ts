import axios from "axios";
import { CREATE_USER_URL } from "./helpers";

type userDataType = {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  role: string;
};

export async function createUser(data: userDataType) {
  try {
    console.log({ CREATE_USER_URL });
    const response = await axios.post(CREATE_USER_URL, data);
    console.log({ response });
    return response.data.response;
  } catch (error) {
    console.log({ error });
    return [];
  }
}
