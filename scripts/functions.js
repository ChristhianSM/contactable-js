import DOMHandler from "./dom-handler.js";
import HomePage from "./pages/HomePage.js";
import STORE from "./store.js";

export function fnCancel(selector) {
  const btnCancel = document.querySelector(selector);
  btnCancel.addEventListener("click", async (event) => {
    event.preventDefault();
    STORE.currentPage = "Contactable";
    DOMHandler.load(HomePage);
  })
}

export function fnLetters() {
  const letters = {
    A: filterLetter("A"),
    B: filterLetter("B"),
    C: filterLetter("C"),
    D: filterLetter("D"),
    E: filterLetter("E"),
    F: filterLetter("F"),
    G: filterLetter("G"),
    H: filterLetter("H"),
    I: filterLetter("I"),
    J: filterLetter("J"),
    K: filterLetter("K"),
    L: filterLetter("L"),
    M: filterLetter("M"),
    N: filterLetter("N"),
    O: filterLetter("O"),
    P: filterLetter("P"),
    Q: filterLetter("Q"),
    R: filterLetter("R"),
    S: filterLetter("S"),
    T: filterLetter("T"),
    U: filterLetter("U"),
    W: filterLetter("W"),
    X: filterLetter("X"),
    Y: filterLetter("Y"),
    Z: filterLetter("Z"),
  }
  return letters
}

function filterLetter(letter) {
  return STORE.contacts.filter( contact => contact.name[0].toUpperCase() === letter);
}