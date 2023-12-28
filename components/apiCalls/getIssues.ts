import axios from "axios";

export const URL = "https://express-api-1ycv.onrender.com"; //  "http://localhost:3003";

export async function getIssues(status: string, page: number, userId: number) {
  status = status === "All" ? null : status;
  console.log("page", page);
  const url = URL + "/issues";
  try {
    const response = await axios.post(url, {
      status,
      page,
      userId,
    });
    return response.data.response;
  } catch (error) {
    console.log({ error });
    return [];
  }
}
