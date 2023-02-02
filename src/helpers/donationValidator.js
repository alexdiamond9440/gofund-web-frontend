import moment from 'moment';

const errors = {
  routingNumber: '',
  accountNumber: '',
  ssn: '',
  dateOfBirth: '',
  file: ''
};

export const donationValidator = (data, method) => {
  let formIsValid = true;
  if (method === 'stripe') {
    if (data.routingNumber === '') {
      formIsValid = false;
      errors['routingNumber'] = 'Routing Number is Required';
    } else if (typeof data.routingNumber !== 'undefined' && !data.routingNumber.match(/^\d+$/)) {
      formIsValid = false;
      errors['routingNumber'] = 'Only numbers are allowed';
    } else if (typeof data.routingNumber !== 'undefined' && data.routingNumber.length !== 9) {
      formIsValid = false;
      errors['routingNumber'] = 'Routing number should be of 9 digits';
    } else {
      errors['routingNumber'] = '';
    }

    if (data.accountNumber === '') {
      formIsValid = false;
      errors['accountNumber'] = 'Account Number is Required';
    } else if (typeof data.accountNumber !== 'undefined' && !data.accountNumber.match(/^\d+$/)) {
      formIsValid = false;
      errors['accountNumber'] = 'Only numbers are allowed';
    } else {
      errors['accountNumber'] = '';
    }

    if (data.personalIdNumber === '' && !data.isPersonalIdNumberProvided) {
      formIsValid = false;
      errors['personalIdNumber'] = 'Personal id Number is Required';
    } else if (data.personalIdNumber && !data.personalIdNumber.match(/^\d+$/)) {
      formIsValid = false;
      errors['personalIdNumber'] = 'Only numbers are allowed';
    } else if (data.personalIdNumber && data.personalIdNumber.length !== 9) {
      formIsValid = false;
      errors['personalIdNumber'] = 'Personal id number should be of 9 digits';
    } else {
      errors['personalIdNumber'] = '';
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

    if (data.file === '') {
      formIsValid = false;
      errors['file'] = 'Please upload your identity document.';
    } else {
      errors['file'] = '';
    }
    if (data.mobileNumber === '') {
      formIsValid = false;
      errors['stripeMobileNumber'] = 'Mobile number is required';
    } else if (
      typeof data.mobileNumber !== 'undefined' &&
      data.mobileNumber &&
      (!/^(?=.*(?:(?:\d[ -]?){1,12}))\d(?:[0-9 -/(/)]*\d)?$/.test(data.mobileNumber) ||
        // (isNaN(data.mobileNumber)
        data.mobileNumber.length < 10)
    ) {
      formIsValid = false;
      errors['stripeMobileNumber'] = 'Please enter valid mobile number';
    } else {
      errors['stripeMobileNumber'] = '';
    }

    if (data.address === '') {
      formIsValid = false;
      errors['address'] = 'Address is Required';
    } else {
      errors['address'] = '';
    }

    if (data.state === '') {
      formIsValid = false;
      errors['stateName'] = 'State is required';
    } else {
      errors['stateName'] = '';
    }

    if (data.city === '') {
      formIsValid = false;
      errors['cityName'] = 'City name is required';
    } else {
      errors['cityName'] = '';
    }

    if (data.postalCode === '') {
      formIsValid = false;
      errors['postalCode'] = 'Postal code is required';
    } else {
      errors['postalCode'] = '';
    }
  }
  if (method === 'paypal') {
    if (
      typeof data.email !== 'undefined' &&
      data.email &&
      !data.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
    ) {
      formIsValid = false;
      errors['email'] = 'Please enter valid email address';
    } else {
      errors['email'] = '';
    }

    if (
      typeof data.mobileNumber !== 'undefined' &&
      data.mobileNumber &&
      (!/^(?=.*(?:(?:\d[ -]?){1,12}))\d(?:[0-9 -/(/)]*\d)?$/.test(data.mobileNumber) ||
        // (isNaN(data.mobileNumber)
        data.mobileNumber.length > 20 ||
        data.mobileNumber.length < 7)
    ) {
      formIsValid = false;
      errors['mobileNumber'] = 'Please enter your valid mobile number of 7-20 digits.';
    } else {
      errors['mobileNumber'] = '';
    }

    if (data.paypalCity === '') {
      formIsValid = false;
      errors['paypalCity'] = 'City name is required';
    } else {
      errors['paypalCity'] = '';
    }

    if (data.paypalState === '') {
      formIsValid = false;
      errors['paypalState'] = 'State is required';
    } else {
      errors['paypalState'] = '';
    }

    if (data.paypalCountryId === '') {
      formIsValid = false;
      errors['paypalCountryId'] = 'Country is required';
    } else {
      errors['paypalCountryId'] = '';
    }
  }
  return {
    formIsValid,
    errors
  };
};
