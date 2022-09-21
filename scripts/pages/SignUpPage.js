import { input } from "../components/input.js";
import DOMHandler from "../dom-handler.js";
import { notification } from "../notifications.js";
import { signUp } from "../services/users-services.js";
import STORE from "../store.js";
import HomePage from "./HomePage.js";
import LoginPage from "./login-page.js";

function render() {
  const { signupError, currentUser } = SignUpPage.state;

  return `
  <main class="">
    <section class="container">
      <div class="page-container">
        <div class="container-login"><p class="head-login">SignUp</p></div>
        <form action="" id="signupform" class = "js-signUp-form">
          ${input({
            id: "email",
            placeholder: "Email",
            value: currentUser.email,
            error : signupError.email
          })}
          ${input({
            id: "password",
            type: "password",
            placeholder: "Password",
            error : signupError.password
          })}
          ${input({
            id: "confirmPassword",
            type: "password",
            placeholder: "Confirm Password",
            error : signupError.confirmPassword
          })}
        </form>
        <div class="footer-container">
          <a class="button-style js-login">Login</a>
          <input
            type="submit"
            form="signupform"
            value="Create Account"
            class="button-style"
          />
        </div>
      </div>
    </section>
  </main>
  `;
}

function resetState() {
  SignUpPage.state.currentUser = {};
  SignUpPage.state.signupError = {
    email: '',
    password: '',
    confirmPassword: ''
  };
}

function validFields( password, confirmPassword) {
  let valid = true;
  const inputPassword = document.querySelector("#password");
  const inputConfirmPassword = document.querySelector("#confirmPassword");

  if (password !== confirmPassword) {
    inputConfirmPassword.classList.add("input-error");
    inputPassword.classList.add("input-error");
    notification("Password and its confirmation must be the same", "error");
    return false
  }else{
    inputConfirmPassword.classList.remove("input-error");
    inputPassword.classList.remove("input-error");
    SignUpPage.state.signupError.confirmPassword = "";
    SignUpPage.state.signupError.password = "";
  }
  return valid
}

function listenSubmitForm() {
  try {
    const form = document.querySelector(".js-signUp-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const { email, password, confirmPassword } = event.target;
      const data = {
        email: email.value,
        password: password.value,
      };
      
      SignUpPage.state.currentUser = data;
      const valid = validFields(password.value, confirmPassword.value);
      if (!valid) {
        SignUpPage.state.signupError.confirmPassword = "Password and its confirmation must be the same";
        SignUpPage.state.signupError.password = "Password and its confirmation must be the same";
        return DOMHandler.load(SignUpPage);
      }

      try {
        await signUp(data);
        await STORE.fetchContacts();
        DOMHandler.load(HomePage);
      } catch (error) {
        const errors = JSON.parse(error.message);
        SignUpPage.state.signupError.email = errors.errors[0];
        errors.errors.forEach( error => notification(error, "error"));
        return DOMHandler.reload();
      }
      resetState();
    });
  } catch (error) {

    // SignUpPage.state.loginError = error.message;
    DOMHandler.reload();
  }
}

function listenBtnLogin() {
  const btnLogin = document.querySelector(".js-login");
  btnLogin.addEventListener("click", () => {
    resetState();
    DOMHandler.load(LoginPage);
  })
}

const SignUpPage = {
  toString() {
    return render();
  },
  addListeners() {
    listenSubmitForm();
    listenBtnLogin();
  },
  state: {
    currentUser: {
      email: '',
      password: ''
    },
    signupError: {
      email: '',
      password: '',
      confirmPassword: ''
    },
  },
};

export default SignUpPage;