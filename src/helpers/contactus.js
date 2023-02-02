const errors = {
    name:"",
    email: "",
    message: "",
  };
export const contactusValidator = (data) => {
    let formIsValid = true;
    if (!data.name) {
        formIsValid = false;
        errors["name"] = "Name is required";
      } else if (
        typeof data.firstName !== "undefined" &&
        !data.firstName.match(/^[a-zA-Z][a-zA-Z\s]*$/)
      ) {
        formIsValid = false;
        errors["name"] = "Only alphabets are allowed.";
      } else {
        errors["name"] = "";
      }
      if (!data.email) {
        formIsValid = false;
        errors["email"] = "Email is required";
      } else if (
        typeof data.email !== "undefined" &&
        !data.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
      ) {
        formIsValid = false;
        errors["email"] = "Please enter valid email address";
      } else {
        errors["email"] = "";
      }
      if (!data.message) {
        formIsValid = false;
        errors["message"] = "Message is required";
      } else {
        errors["message"] = "";
      }
      return {
        formIsValid,
        errors,
      };
}