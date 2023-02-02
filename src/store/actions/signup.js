import axios from "axios";
import { actionTypes } from "./actionTypes";
import { push } from "react-router-redux";
import { toastr } from "react-redux-toastr";

function signup(data, urlToredirect) {
  return dispatch => {
    dispatch(request({ data }));
    axios
      .post("/users/signup", data)
      .then(response => {
        const authData = {
          token: response.data.token,
          userId: response.data.data.id
        };
        localStorage.setItem("user", JSON.stringify(authData));
        localStorage.removeItem('redirectionUrl');
        toastr.success("Success", response.data.message);
        axios.defaults.headers.common["Authorization"] = response.data
          ? response.data.token
          : "";
        dispatch(success(data));
        dispatch(loginSuccess(data));
        if (urlToredirect) {
          dispatch(push(urlToredirect));
        } else {
          dispatch(push("/my-sponsor-pages"));
        }
      })
      .catch(error => {
        let errorData = error.response ? error.response.data : error;

        toastr.error("Error", errorData.message);
        dispatch(failure(errorData.message));
      });
  };
  function request(user) {
    return { type: actionTypes.SIGNUP_REQUEST, user };
  }
  function success(user) {
    return { type: actionTypes.SIGNUP_SUCCESS, user };
  }
  function loginSuccess(user) {
    return { type: actionTypes.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: actionTypes.SIGNUP_FAILURE, error };
  }
}

export default signup;
