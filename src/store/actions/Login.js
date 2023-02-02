import axios from "axios";
import { push } from "react-router-redux";
import { actionTypes } from "./actionTypes";
import { toastr } from "react-redux-toastr";

export function login(data, urlToredirect) {
  return dispatch => {
    dispatch(request({ data }));
    axios
      .post("/users/login", data)
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
        dispatch(success(authData));
        if (urlToredirect) {
          dispatch(push(urlToredirect));
        } else {
          dispatch(push("/dashboard"));
        }
      })
      .catch(error => {
        let errorData = error.response ? error.response.data : error;
        toastr.error("Error", errorData.message);
        dispatch(failure(errorData.message));
      });
  };
}

export function socialLogin(data, urlToredirect) {
  return dispatch => {
    dispatch(request({ data }));
    axios
      .post("/users/social_login", data)
      .then(response => {
        const authData = {
          token: response.data.token,
          userId: response.data.data.id
        };
        localStorage.setItem("user", JSON.stringify(authData));
        toastr.success("Success", response.data.message);
        axios.defaults.headers.common["Authorization"] = response.data
          ? response.data.token
          : "";
        dispatch(success(authData));
        if (urlToredirect) {
          dispatch(push(urlToredirect));
        } else {
        dispatch(push("/my-sponsor-pages"));
        }
        // dispatch(push("/my-projects"));
      })
      .catch(error => {
        let errorData = error.response ? error.response.data : error;
        toastr.error("Error", errorData.message);
        dispatch(failure(errorData.message));
      });
  };
}

function request(user) {
  return { type: actionTypes.LOGIN_REQUEST, user };
}
function success(user) {
  return { type: actionTypes.LOGIN_SUCCESS, user };
}
function failure(error) {
  return { type: actionTypes.LOGIN_FAILURE, error };
}

export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem('redirectionUrl');
  return { type: actionTypes.LOGOUT };
}
