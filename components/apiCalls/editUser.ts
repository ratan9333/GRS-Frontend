import axios from "axios";
import { EDIT_USER_URL } from "./helpers";

type userDataType = {
  name: string;
  email: string;
  phone_number: string;
  id: string | number;
};

export async function editUser(data: userDataType) {
  try {
    const response = await axios.post(EDIT_USER_URL, data);
    return response.data.response;
  } catch (error) {
    return [];
  }
}
