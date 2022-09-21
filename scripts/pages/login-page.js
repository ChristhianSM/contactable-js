import { input } from "../components/input.js";
import DOMHandler from "../dom-handler.js";
import { notification } from "../notifications.js";
import { login } from "../services/session-servicios.js";
import STORE from "../store.js";
import HomePage from "./HomePage.js";
import SignUpPage from "./SignUpPage.js";

function render() {
  const { loginError, currentState } = LoginPage.state;
  return `
  <main class="">
    <section class="container">
      <div class="page-container">
        <div class="container-login"><p class="head-login">Login</p></div>
        <form action="" id="loginform" class = "js-login-form">
          ${input({
            id: "email",
            placeholder: "Email",
            error: loginError,
            value: currentState.email
          })}
          ${input({
            id: "password",
            type: "password",
            placeholder: "Password",
            error: loginError,
            value: currentState.password
          })}
        </form>
        <div class="footer-container">
          <a class="button-style js-sign-up">Signup</a>
          <input
            type="submit"
            form="loginform"
            value="Login"
            class="button-style"
          />
        </div>
      </div>
    </section>
  </main>
  `
}

function resetState() {
  LoginPage.state.currentState = {};
  LoginPage.state.loginError = "";
}

function listenSubmitForm() {
  try {
    const form = document.querySelector(".js-login-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const {email, password} = event.target;
      const credentials = {
        email: email.value,
        password: password.value,
      }
      LoginPage.state.currentState = {
        email: email.value,
        password : ""
      };
      try {
        await login(credentials);
        await STORE.fetchContacts();
        DOMHandler.load(HomePage);
      } catch (error) {
        const errors = JSON.parse(error.message);
        notification(errors.errors[0], "error");
        LoginPage.state.loginError = errors.errors[0];
        DOMHandler.reload();
      }
      resetState();
    })
  } catch (error) {
    LoginPage.state.loginError = error.message;
    DOMHandler.reload();
  }
}

function listenBtnSignUp() {
  const btnSignUp = document.querySelector(".js-sign-up");
  btnSignUp.addEventListener("click", () => {
    DOMHandler.load(SignUpPage);
  })
}

const LoginPage = {
  toString(){
    return render();
  },
  addListeners() {
    listenSubmitForm();
    listenBtnSignUp();
  },
  state: {
    currentState: {
      email: "",
      password : ""
    },
    loginError: ""
  }
}

export default LoginPage;