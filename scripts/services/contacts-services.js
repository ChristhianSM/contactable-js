import { apiFetch } from "./api-fetch.js";

export async function getContacts() {
  try {
     return await apiFetch("contacts");
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createContact(newContact = {name, number, email, relation: "friends" }) {
  const response = await apiFetch("contacts", {body: newContact});

  return response;
}

export async function updateContact(data = {name, number, email, relation, favorite }, idContact) {
  const response = await apiFetch(`contacts/${idContact}`, {body: data, method: "PATCH"});

  return response;
}
export async function favoriteContact (favorite, idContact){
  const response = updateContact({favorite}, idContact)
  return response;
}

export async function deleteContact(idContact) {
  const response = await apiFetch(`contacts/${idContact}`, {method: "DELETE"});

  return response;
}