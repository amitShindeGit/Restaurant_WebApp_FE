import axios from "axios";

export default class Auth {
  static getLoggedInUser = async (email, password) => {
    return axios.post("http://localhost:5000/user/login", email, password);
    //todo get user details
    // console.log(loggedInUser);
    // return {
    //   data: {
    //     message: "Login Successful",
    //   },
    //   loggedInUser,
    //   token: "csdsidvisgvuubsvu40953094rfh"
    // };
  };

  static postSignupUser = async (name, email, password) => {
    return axios.post(
      "http://localhost:5000/user/signup",
      name,
      email,
      password
    );

    // return {
    //   data: {
    //     message: "Signup Successful",
    //   },
    //   signupUser,
    //   token: "csdsidvisgvuubsvu40953094rfh"
    // };
  };
}
