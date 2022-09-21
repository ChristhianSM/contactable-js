import { tokenKey } from "../config.js";
import { apiFetch } from "./api-fetch.js";

export async function createUser(newUser = { email, password, firstname, lastname, phone }) {
  const { token, ...user } = await apiFetch("signup", {body: newUser});
  sessionStorage.setItem(tokenKey, token);

  // Aqui devolvemos user sin el token
  return user;
}

export async function updateUser(data = { email, firstname, lastname, phone }) {
  const { token, ...user } = await apiFetch("profile", {body: data, method: "PATCH"});

  // Aqui devolvemos user sin el token
  return user;
}

export async function getUser() {
  const { token, ...user } = await apiFetch("profile");

  // Aqui devolvemos user sin el token
  return user;
}

export async function signUp(credentials = { email, password }) {
  const { token, ...user } = await apiFetch("signup", { body: credentials });
  sessionStorage.setItem(tokenKey, token);

  // Aqui devolvemos user sin el token
  return user;
}