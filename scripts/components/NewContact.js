import { input } from "../components/input.js";
import DOMHandler from "../dom-handler.js";
import { fnCancel } from "../functions.js";
import { notification } from "../notifications.js";
import HomePage from "../pages/HomePage.js";
import { createContact, updateContact } from "../services/contacts-services.js";
import STORE, { orderContacts } from "../store.js";
import Home from "./Home.js";

function render() {
  const { currentContact } = STORE;
  const { contactError, currentState } = NewContact.state;
  const relations = ["Family", "Friends", "Work", "Acquaintance"];

  return `
  <form action="" id="contactForm" class = "js-contact-form">
    ${input({
      id: "name",
      placeholder: "Name",
      value: (currentContact ? currentContact.name : currentState.name ? currentState.name : ""), 
      error: contactError.name || ""
    })}
    ${input({
      id: "number",
      type: "text",
      placeholder: "number",
      value: (currentContact ? currentContact.number : currentState.number ? currentState.number : ""),
      error: contactError.number
    })}
    ${input({
      id: "email",
      type: "email",
      placeholder: "Email",
      value: (currentContact ? currentContact.email : currentState.email ? currentState.email : ""),
      error: contactError.email
    })}
    <div class = "container-input">
      <select name="relation" id="js-relation" class = "inputs select_input">
        ${ relations.map( relation => {
          return `
          <option value="${relation}" ${relation === currentContact?.relation ? 'selected': ''}>${relation}</option>
          `
        })}
      </select>
    </div>
  </form>
  <div class="footer-container">
    <a class="button-style js-cancel">Cancel</a>
    <input
      type="submit"
      form="contactForm"
      value="Save"
      class="button-style"
    />
  </div>
  `
}

function saveStore(property, idContact, response) {
  STORE[property] = STORE[property].map(contact => {
    if (contact.id === idContact) {
      return response
    }else {
      return contact
    }
  })
}

function resetState() {
  NewContact.state.currentState = {}
  NewContact.state.contactError = {
    name: "",
    number: "",
    email: ""
  }
}

function validName(name) {
  const exitName = STORE.contacts.some( contact => contact.name === name);
  if (exitName) {
    NewContact.state.contactError.name = "Contact with that name already exists";
  }else{
    NewContact.state.contactError.name = "";
  }
  return exitName;
}

function listenSubmitForm() {
  try {
    const form = document.querySelector(".js-contact-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const {name, number, email, relation} = event.target;
      const data = {
        name: name.value,
        number: number.value,
        email: email.value,
        relation: relation.value,
      }
      // Guardamos el estado de nuestro formulario 
      NewContact.state.currentState = data;

      //Verficamos si el nombre del contacto esta repetido
      if(validName(name.value)) return DOMHandler.reload();

      // Verificamos si estamos actualizando o creando un contacto
      let message = "";
      try {
        let response = "";
        if (STORE.currentContact) {
          const idContact = STORE.currentContact.id;
          response = await updateContact(data, idContact);
          saveStore("contacts", idContact, response);
          saveStore("favorites", idContact, response);
          message = "Contact Updated Correctly";
        }else {
          response = await createContact(data);
          STORE.contacts.push(response);
          message = "Contact Added Correctly";
        }
        resetState();
      } catch (error) {
        const errors = JSON.parse(error.message);
        const { contactError } = NewContact.state;
        let mensajes = [];
        for (const key in contactError) {
          for (const keyError in errors) {
            if (key === keyError) {
              NewContact.state.contactError[key] = errors[keyError];
              notification(`${key} : ${errors[keyError]}`, "error")
              mensajes.push(errors[keyError]);
              break;
            }else {
              NewContact.state.contactError[key] = "";
            }
          }
        }
        // notification(mensajes.flat().join("\n"), "error")
        return DOMHandler.reload();
      }
      STORE.contacts = orderContacts(STORE.contacts);

      // Actualizar el STORE
      STORE.currentPage = "Contactable";
      DOMHandler.load(HomePage);

      //Lanzamos la notificacion
      notification(message, "success");
    })
  } catch (error) {
    NewContact.state.contactError = error.message;
    DOMHandler.reload();

    //Lanzamos la notificacion
    notification(error.message, "error")
  }
}

function listenCancel() {
  fnCancel(".js-cancel");
  resetState();
}

const NewContact = {
  toString(){
    return render();
  },
  addListeners() {
    listenSubmitForm();
    listenCancel();
  },
  state: {
    currentState : {},
    contactError:{
      name: "",
      number: "",
      email: ""
    }
  }
}

export default NewContact;