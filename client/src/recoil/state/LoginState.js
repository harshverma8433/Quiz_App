import { atom } from "recoil";

const LoginState = atom({
  key: "login",
  default: {
    panel: "user",
    email: "",
    password: "",
  },
});

export default LoginState;
