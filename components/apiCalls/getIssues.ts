import axios from "axios";
import { GET_ALL_ISSUES } from "./helpers";

export const URL = "https://express-api-1ycv.onrender.com"; // "http://localhost:3003"; //"https://express-api-1ycv.onrender.com"; //

export async function getIssues(status: string, page: number, userId: number) {
  status = status === "All" ? null : status;
  try {
    const response = await axios.post(GET_ALL_ISSUES, {
      status,
      page,
      userId,
    });
    console.log({ response });
    return response.data.response;
  } catch (error) {
    console.log({ error });
    return [];
  }
}
