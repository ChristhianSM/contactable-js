import Home from "../components/Home.js";
import DOMHandler from "../dom-handler.js";
import { logout } from "../services/session-servicios.js";
import STORE from "../store.js";
import DetailContact from "../components/DetailContact.js";
import LoginPage from "./login-page.js";
import NewContact from "../components/NewContact.js";

function render() {
  const { currentPage } = STORE;
  // setTimeout(() => {
  //   console.log("Hola")
  //   HomePage.state.loading = false;
  //   DOMHandler.load(HomePage);
  // }, 1500);
  return `
    <div class="home-container">
      <div class="container-login">
        <div class="home-header">
          <h1 class="home-heading">${currentPage}</h1>
          <a href="#" class = "js-logout">Logout</a>
        </div>
      </div>
      ${ currentPage === "Contactable" ? Home : ""}
      ${ currentPage === "Create New Contact" ? NewContact : ""}
      ${ currentPage === "Detail Contact" ? DetailContact : ""}
      ${ currentPage === "Edit Contact" ? NewContact : ""}
    </div>
  `;
}

function listenLogout() {
  const btnLogout = document.querySelector(".js-logout");
  btnLogout.addEventListener("click", async () => {
    await logout();
    DOMHandler.load(LoginPage);
  });
}

const HomePage = {
  toString() {
    return render();
  },
  addListeners() {
    listenLogout();
    if (STORE.currentPage === "Contactable") Home.addListeners();
    if (["Create New Contact", "Edit Contact"].includes(STORE.currentPage)) NewContact.addListeners();
    if (STORE.currentPage === "Detail Contact") DetailContact.addListeners();
  },
  state: {
    loading: true
  }
};

export default HomePage;
