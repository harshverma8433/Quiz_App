import { atom } from "recoil";

const RegisterState = atom({
  key: "register",
  default: {
    name:"",
    email: "",
    password: "",
    phone_no :"",
    message:""
  },
});

export default RegisterState;
