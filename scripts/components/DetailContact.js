import DOMHandler from "../dom-handler.js";
import { fnCancel } from "../functions.js";
import HomePage from "../pages/HomePage.js";
import { deleteContact } from "../services/contacts-services.js";
import STORE from "../store.js";

function render() {
  const { currentContact } = STORE;
  return `
  <div class = "detail-contact gap-4">
    <div class = "flex justify-center flex-column items-center animate__animated animate__fadeInDown">
      <img src = "assets/images/default_avatar.png" class = "mb-4">
      <p class = "mb-1">${currentContact.name}</p>
      <p class = "mb-1 detail_type content-sm">${currentContact.relation}</p>
    </div>
    <div class = "info-contact animate__animated animate__fadeInUp">
      <p class = "mb-4">Number : <span>${currentContact.number}<span></p>
      <p class = "">Email : <span>${currentContact.email}<span></p>
    </div>
  </div>
  <div class="footer-container">
    <a class="button-style js-cancel">Back</a>
    <a class="button-style js-delete">Delete</a>
    <a class="button-style js-edit">Edit</a>
  </div>
  `
}

function listenCancel() {
  fnCancel(".js-cancel");
}

function listenDeleteContact() {
  const btnDelete = document.querySelector(".js-delete");
  btnDelete.addEventListener("click", async (event) => {
    event.preventDefault();
    //Eliminamos el contacto del store.
    STORE.contacts = STORE.contacts.filter( contact => contact.id !== STORE.currentContact.id);
    STORE.currentPage = "Contactable"

    // Eliminamos el contacto tambien de los favoritos en caso se encuentre ahi: 
    STORE.favorites = STORE.favorites.filter( contact => contact.id !== STORE.currentContact.id);

    // Eliminacion de la bd
    await deleteContact(STORE.currentContact.id);
    DOMHandler.load(HomePage);
  })
}

function listenEditContact() {
  const btnEdit = document.querySelector(".js-edit");
  btnEdit.addEventListener("click", (event) => {
    event.preventDefault();
    STORE.currentPage = "Edit Contact";
    DOMHandler.load(HomePage);
  })
}

const DetailContact = {
  toString(){
    return render();
  },
  addListeners() {
    listenCancel();
    listenDeleteContact();
    listenEditContact();
  }
}

export default DetailContact;