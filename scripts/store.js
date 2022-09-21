import { getContacts } from "./services/contacts-services.js";

export function orderContacts(contacts){
  return contacts.sort( (item1, item2) => {
    if (item1.name < item2.name) {
      return -1;
    }else if (item1.name > item2.name) {
      return 1;
    }else{
      return 0;
    }
  })
}

async function fetchContacts () {
  let contacts = await getContacts();
  contacts = orderContacts(contacts);
  this.favorites = contacts.filter((contact)=>contact.favorite);
  this.favorites = orderContacts(this.favorites);
  this.contacts = contacts;
  return contacts; 
}

const STORE = {
  contacts : [],
  favorites: [],
  currentContact: null,
  currentPage: "Contactable",
  fetchContacts,
  loading: true
}

export default STORE;