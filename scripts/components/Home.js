import DOMHandler from "../dom-handler.js";
import { fnLetters } from "../functions.js";
import HomePage from "../pages/HomePage.js";
import { favoriteContact } from "../services/contacts-services.js";
import STORE, { orderContacts } from "../store.js";
import { input } from "./input.js";

function renderContact(contact) {
  return `
  <li class="contact js-contact" data-id = ${contact.id}>
    <img src="assets/images/default_avatar.png" alt="" class="contact__img">
    <p class="contact__name">${contact.name}</p>
    <img src="assets/images/${contact.favorite ? "star" : "star-empty"}.png" alt="img-favorite" width = "20" class="contact__favorite">
  </li>
  `;
}

function renderFavorites(favorites){
  return `
  <div class="container-contacts">
    <div class="contacts-quantity">
        <p>FAVORITES (${favorites.length})</p>
    </div>
    <ul class="contacts">
      ${favorites
        .map((contact) => {
          return renderContact(contact);
        })
        .join("")}
    </ul>
  </div>
    `
}

function render() {
  const { contacts, favorites } = STORE;
  const { search, query } = Home.state;
  const letters = fnLetters();

  return `
    <form class = "js-form-search flex gap-4 items-center container-login m-20">
      <input id="inputSearch" class = "inputs" placeholder="Search Contact" value = "${query}"/>
      <button type = "submit" class = "btnSearch" href = "#" > Search </button>
    </form>
    ${favorites.length > 0 ? renderFavorites(favorites) : ""}
    <div class="container-contacts">
      <div class="contacts-quantity">
        <p>CONTACTS (${contacts.length})</p>
      </div>
      ${ search.length === 0 && query.length !== 0
        ? `<div class = "flex items-center justify-center h-300 flex-column gap-4">
            <img class="loupe_contact" src = "assets/images/loupe.png"/>
            <p>There aren't contacts, try another search</p>
          </div>`
        : search.length > 0 
          ? `<ul class="contacts">
              ${search.map(renderContact).join("")}
            </ul>`
          : contacts.length > 0 
            ? `<ul class="contacts">
                ${
                  Object.keys(letters).map((letter) => 
                  letters[letter].map((contact, index) => `<p>${ index === 0 ? letter : ''} ${renderContact(contact)}`).join('')).join('')
                }
              </ul>`
            : `<div class = "flex items-center justify-center h-300 flex-column gap-4">
                  <img class="empty_contact" src = "assets/images/empty-contacts.png"/>
                  <p>There are no contacts to show</p>
                </div>` 
      }
     
    </div>
    <div class="addcontact cursor-pointer js-addcontact">
      <img src="assets/images/Union.png" alt="">
    </div>
  `;
}

function resetState() {
  Home.state = {
    query: "",
    search: []
  }
}

function listenContact() {
  const li = document.querySelectorAll(".js-contact");
  li.forEach((liContact) => {
    liContact.addEventListener("click", (event) => {
      const idContact = liContact.dataset.id;

      //Buscamos el contacto en nuestro STORE
      const findContact = STORE.contacts.find(
        (contact) => contact.id === parseInt(idContact)
      );
      STORE.currentContact = findContact;
      STORE.currentPage = "Detail Contact";
      resetState();
      DOMHandler.load(HomePage);
    });
  });
}

function listenFavoriteContact() {
  const favButtons = document.querySelectorAll(".contact__favorite");
  favButtons.forEach((favButton) => {
    favButton.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const idContact = favButton.parentElement.dataset.id;
      const findContact = STORE.contacts.find(
        (contact) => contact.id === parseInt(idContact)
      );
      
      // Actualizamos el STORE.favorites
      const existContactFavorite = STORE.favorites.some( favorite => favorite.id == idContact);
      if (!existContactFavorite) {
        STORE.favorites.push(findContact);
        STORE.favorites = orderContacts(STORE.favorites);
      }else {
        STORE.favorites = STORE.favorites.filter( favorite => favorite.id != idContact);
      }

      // Actualizamos el STORE Completo
      STORE.contacts = STORE.contacts.map((contact)=> {
        if (contact.id == idContact) { 
          contact.favorite = !contact.favorite;
          return {
            ...contact
          }
        }else{
          return contact;
        }
      })
      
      // Actualizamos la bd
      const updatedContact = await favoriteContact(findContact.favorite, idContact);
      DOMHandler.reload();
    });
  });
}

function listenSearch() {
  const formSearch = document.querySelector(".js-form-search");
  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = document.querySelector("#inputSearch").value;
    Home.state.query = query;
    if (query !== "") {
      Home.state.search = STORE.contacts.filter( contact => {
        const position = contact.name.toLowerCase().indexOf(query.toLowerCase());
        if (position !== -1) {
          return contact
        }
      });
    }else {
      Home.state.search = [];
    }
    DOMHandler.reload();
  })
}

function listenAddContact() {
  const btnAddContact = document.querySelector(".js-addcontact");
  btnAddContact.addEventListener("click", async () => {
    STORE.currentPage = "Create New Contact";
    STORE.currentContact = null;
    resetState();
    DOMHandler.load(HomePage);
  });
}

const Home = {
  toString() {
    return render();
  },
  addListeners() {
    if (STORE.currentPage === "Contactable") {
      listenAddContact();
      listenContact();
      listenFavoriteContact();
    }
    if (STORE.currentPage === "Create New Contact") listenAddContact();
    if (STORE.currentPage === "Contactable") {
      listenAddContact();
      listenSearch();
    }
  },
  state: {
    query: "",
    search: []
  }
};

export default Home;
