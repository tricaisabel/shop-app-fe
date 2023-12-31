import { AxiosError, AxiosResponse } from "axios";
import { API } from "./product";

export const auth = async (
  requestBody: object,
  type: string,
  setUrl: (email: string) => void,
  setEmail: (email: string) => void,
  setIsAdmin: (isAdmin: boolean) => void,
  navigate: (url: string) => void,
  showToastMessage: (message: string) => void
) => {
  return API.post(`/auth/${type}`, requestBody)
    .then((response: AxiosResponse) => {
      const { user } = response.data;
      if (user) {
        setEmail(user.email);
        setUrl(user.url);
        setIsAdmin(user.isAdmin);
        localStorage.setItem("email", user.email);
        localStorage.setItem("url", user.url);
        localStorage.setItem("isAdmin", user.isAdmin ? "true" : "false")
        navigate("/products");
      }
    })
    .catch((error: AxiosError) => {
      showToastMessage(error.response?.data as string);
      console.log(error.response?.data);
    });
};

export const logout = async () => {
  localStorage.removeItem("email");
  localStorage.removeItem("url");
  localStorage.removeItem("isAdmin")
  return API.post("/auth/logout")
    .then((response: AxiosResponse) => {
      console.log(response.data);
    })
    .catch((error: AxiosError) => {
      console.log(error.response?.data);
    });
};
