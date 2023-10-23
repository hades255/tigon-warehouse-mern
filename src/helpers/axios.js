import axios_ from "axios";

const AXIOS = axios_.create({
  baseURL: process.env.SERVER_URL || "http://localhost:3000/",
});

AXIOS.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response.status === 401 &&
      !window.location.href.includes("/login")
    ) {
      window.location = "/login";
    }
    return Promise.reject(
      (error.response && error.response.data) || "Wrong Services"
    );
  }
);

export default AXIOS;
