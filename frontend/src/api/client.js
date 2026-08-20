import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

async function request(config) {
  try {
    const res = await apiClient.request(config);
    return res.data.data; // axios wraps the response in .data; our backend wraps ITS payload in .data too
  } catch (err) {
    // Our backend's ApiError shape arrives as err.response.data
    const message = err.response?.data?.message || err.message || "Request failed";
    throw new Error(message);
  }
}

export { apiClient, request };