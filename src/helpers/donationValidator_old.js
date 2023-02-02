import moment from 'moment';

const errors = {
  routingNumber: '',
  accountNumber: '',
  ssn: '',
  dateOfBirth: '',
  file: '',
};

export const donationValidator = data => {
  let formIsValid = true;

  if (data.accHolderFirstName === "") {
    formIsValid = false;
    errors["accHolderFirstName"] = "First name field is required";
  } else if (
    typeof data.accHolderFirstName !== "undefined" &&
    !data.accHolderFirstName.match(/^[a-zA-Z][a-zA-Z\s]*$/)
  ) {
    formIsValid = false;
    errors["accHolderFirstName"] =
      "It must contain alphabets only.";
  } else {
    errors["accHolderFirstName"] = "";
  }

  if (data.accHolderLastName === "") {
    formIsValid = false;
    errors["accHolderLastName"] =
      "Last Name is required";
  } else if (
    typeof data.accHolderLastName !== "undefined" &&
    !data.accHolderLastName.match(/^[a-zA-Z][a-zA-Z\s]*$/)
  ) {
    formIsValid = false;
    errors["accHolderLastName"] = "It must contain alphabets only.";
  } else {
    errors["accHolderLastName"] = "";
  }

  if (data.routingNumber === '') {
    formIsValid = false;
    errors['routingNumber'] = 'Routing Number is Required';
  } else if (
    typeof data.routingNumber !== 'undefined' &&
    !data.routingNumber.match(/^\d+$/)
  ) {
    formIsValid = false;
    errors['routingNumber'] = 'Only numbers are allowed';
  } else if (
    typeof data.routingNumber !== 'undefined' &&
    data.routingNumber.length !== 9
  ) {
    formIsValid = false;
    errors['routingNumber'] = 'Routing number should be of 9 digits';
  } else {
    errors['routingNumber'] = '';
  }

  if (data.accountNumber === '') {
    formIsValid = false;
    errors['accountNumber'] = 'Account Number is Required';
  } else if (
    typeof data.accountNumber !== 'undefined' &&
    !data.accountNumber.match(/^\d+$/)
  ) {
    formIsValid = false;
    errors['accountNumber'] = 'Only numbers are allowed';
  } else {
    errors['accountNumber'] = '';
  }

  if (data.ssn === '') {
    formIsValid = false;
    errors['ssn'] = 'SSN Number is Required';
  } else if (typeof data.ssn !== 'undefined' && !data.ssn.match(/^\d+$/)) {
    formIsValid = false;
    errors['ssn'] = 'Only numbers are allowed';
  } else if (typeof data.ssn !== 'undefined' && data.ssn.length !== 9) {
    formIsValid = false;
    errors['ssn'] = 'SSN should be of 9 digits';
  } else {
    errors['ssn'] = '';
  }

  if (data.date === '') {
    formIsValid = false;
    errors['dateOfBirth'] = 'Date of Birth is Required';
  } else if (!moment(data.date).isValid()) {
    formIsValid = false;
    errors['dateOfBirth'] = 'Invalid date of birth';
  } else {
    errors['dateOfBirth'] = '';
  }

  if (data.addressLine1 === "") {
    formIsValid = false;
    errors["addressLine1"] =
      "Complete Address";
  } else {
    errors["addressLine1"] = "";
  }

  if (data.stateName === "") {
    formIsValid = false;
    errors["stateName"] =
      "State is required";
  } else {
    errors["stateName"] = "";
  }

  if (data.cityName === "") {
    formIsValid = false;
    errors["cityName"] =
      "City name is required";
  } else {
    errors["cityName"] = "";
  }

  if (data.postalCode === '') {
    formIsValid = false;
    errors['postalCode'] = 'Postal Code is Required';
  } else if (typeof data.postalCode !== 'undefined' && !data.postalCode.match(/^\d+$/)) {
    formIsValid = false;
    errors['postalCode'] = 'Only numbers are allowed';
  } else if (typeof data.postalCode !== 'undefined' && data.postalCode.length !== 5) {
    formIsValid = false;
    errors['postalCode'] = 'Postal Code should be of 5 digits';
  } else {
    errors['postalCode'] = '';
  }

  if (data.file === '') {
    formIsValid = false;
    errors['file'] = 'Please upload your identity document.';
  } else {
    errors['file'] = '';
  }

  return {
    formIsValid,
    errors,
  };
};
