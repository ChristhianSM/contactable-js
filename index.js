import { tokenKey } from "./scripts/config.js";
import DOMHandler from "./scripts/dom-handler.js";
import { notification } from "./scripts/notifications.js";
import HomePage from "./scripts/pages/HomePage.js";
import LoginPage from "./scripts/pages/login-page.js";
import STORE from "./scripts/store.js";

async function init() {
  const token = sessionStorage.getItem(tokenKey);

  if (!token) return DOMHandler.load(LoginPage);
  try {
    const response = await STORE.fetchContacts();
    DOMHandler.load(HomePage);
  } catch (error) {
    notification(error.message, "error");
    sessionStorage.removeItem(tokenKey)
    DOMHandler.load(LoginPage)
  }
}

init();