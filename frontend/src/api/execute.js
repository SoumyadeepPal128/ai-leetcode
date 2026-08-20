import { request } from "./client.js";

export async function executeCode(problemId, code,language) {
  return request({
    url: "/execute",
    method: "POST",
    data: { problemId, code,language },
  });
}