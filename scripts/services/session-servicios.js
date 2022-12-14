import { tokenKey } from "../config.js";
import { apiFetch } from "./api-fetch.js";

export async function login(credentials = {email, password}) {
  const { token, ...user } = await apiFetch("login", {body: credentials});
  sessionStorage.setItem(tokenKey, token);

  // Aqui devolvemos user sin el token
  return user;
}

export async function logout() {
  try {
    await apiFetch("logout", {method: "DELETE"});
    sessionStorage.removeItem(tokenKey);
  } catch (error) {
    console.log(error);
  }
}
