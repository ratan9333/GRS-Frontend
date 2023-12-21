import axios from "axios";

export const URL = "http://localhost:3003";

export async function getIssues(status: string) {
  const url = URL + "/issues";
  try {
    const response = await axios.post(url, {
      status,
    });
    return response.data.response;
  } catch (error) {
    console.log({ error });
    return [];
  }
}
