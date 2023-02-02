const errors = {
  email: '',
};
export const newsLetterValidator = data => {
  let formIsValid = true;
  if (data.email === '') {
    formIsValid = false;
    errors['email'] = 'Email field is required';
  } else if (
    typeof data.email !== 'undefined' &&
    !data.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
  ) {
    formIsValid = false;
    errors['email'] = 'Please enter valid email address';
  } else {
    errors['email'] = '';
  }
  return {
    formIsValid,
    errors,
  };
};
