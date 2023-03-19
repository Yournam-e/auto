import axios from "axios";
import { BASE_URL } from "../../constants/api";

export const AX = axios.create({
  baseURL: BASE_URL,
});
