const cardValidator = data => {
  const { cardNumber, expMonth, expYear, cvc } = data;
  const paymentErrors = {};
  const cNumber = cardNumber.replace(/\D+/g, "");

  let isError = false;
  if (cNumber === "" || cNumber.length < 14 || cNumber.length > 17) {
    paymentErrors["cardNumber"] = "Please enter valid card number";
    isError = true;
  }
  if (!expMonth || expMonth > 12 || !expYear) {
    paymentErrors["expireDate"] = "Please enter valid expiration date";
    isError = true;
  }
  if (!cvc || cvc.replace("_", "") === "" || cvc.length > 4 || cvc.length < 3) {
    paymentErrors["cvv"] = "Please enter valid CVV.";
    isError = true;
  }
  return {
    isError,
    paymentErrors
  };
};

export default cardValidator;
