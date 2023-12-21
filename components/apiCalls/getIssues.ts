import axios from "axios";

export const URL = "https://express-api-1ycv.onrender.com";
export async function getIssues(status: string) {
  const url = URL + "/issues";
  console.log({ small: url });
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
