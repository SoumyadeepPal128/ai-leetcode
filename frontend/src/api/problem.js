import { request } from "./client.js";

export async function generateProblem(prompt) {
  return request({
    url: "/generate",
    method: "POST",
    data: { prompt },
  });
}