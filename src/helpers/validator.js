const errors = {
  firstName: "",
  lastName: "",
  email: "",
  rePassword: "",
  bio: "",
  text: "",
  name: "",
  message: "",
};

export const validator = (data) => {
  let formIsValid = true;
  if (data.firstName === "") {
    formIsValid = false;
    errors["firstName"] = "First name is required";
  } else if (
    typeof data.firstName !== "undefined" &&
    !data.firstName.match(/^[a-zA-Z][a-zA-Z\s]*$/)
  ) {
    formIsValid = false;
    errors["firstName"] = "Only alphabets are allowed.";
  } else {
    errors["firstName"] = "";
  }
  if (data.lastName === "") {
    formIsValid = false;
    errors["lastName"] = "Last name is required";
  } else if (
    typeof data.lastName !== "undefined" &&
    !data.lastName.match(/^[a-zA-Z][a-zA-Z\s]*$/)
  ) {
    formIsValid = false;
    errors["lastName"] = "Only alphabets are allowed";
  } else {
    errors["lastName"] = "";
  }
  if (data.email === "") {
    formIsValid = false;
    errors["email"] = "Email field is required";
  } else if (
    typeof data.email !== "undefined" &&
    !data.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
  ) {
    formIsValid = false;
    errors["email"] = "Please enter valid email address";
  } else {
    errors["email"] = "";
  }
  if (data.password === "") {
    formIsValid = false;
    errors["password"] = "Password field is required";
  } else {
    errors["password"] = "";
  }
  if (data.rePassword === "") {
    formIsValid = false;
    errors["rePassword"] = "Confirm password field is required";
  } else if (
    typeof data.rePassword !== "undefined" &&
    data.password !== data.rePassword
  ) {
    formIsValid = false;
    errors["rePassword"] = "Password and confirm password didn't match";
  } else {
    errors["rePassword"] = "";
  }
  if (data.bio === "") {
    formIsValid = false;
    errors["bio"] = "Mini bio name is required";
  } else {
    errors["bio"] = "";
  }
  if (data.message === "") {
    formIsValid = false;
    errors["message"] = "Short message is required";
  } else {
    errors["message"] = "";
  }
  if (data.name === "") {
    formIsValid = false;
    errors["name"] = "name is required";
  } else if (
    typeof data.name !== "undefined" &&
    !data.name.match(/^[a-zA-Z][a-zA-Z\s]*$/)
  ) {
    formIsValid = false;
    errors["name"] = "Only alphabets are allowed.";
  } else {
    errors["name"] = "";
  }
  if (data.text === "") {
    formIsValid = false;
    errors["text"] = "Comment is required";
  } else {
    errors["text"] = "";
  }
  return {
    formIsValid,
    errors,
  };
};
