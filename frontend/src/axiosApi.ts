import axios from "axios";
import {BASE_URL} from "./globalConst.ts";

const axiosApi = axios.create({
    baseURL: BASE_URL,
});

export default axiosApi;