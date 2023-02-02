import axios from "axios";
import { actionTypes } from "./actionTypes";
import { push } from "react-router-redux";

export function ProxyLogin(user) {
  return dispatch => {
    dispatch(request());
    axios
      .get("/profile/get-userinfo")
      .then(response => {
        const redirectionUrl = localStorage.getItem('redirectionUrl');
        localStorage.removeItem('redirectionUrl');
        dispatch({ type: actionTypes.LOGIN_SUCCESS, user });
        dispatch(success(response.data.data));
        dispatch(push(redirectionUrl || "/dashboard"));
      })
      .catch(error => {
        if (error.response && error.response.data.responseCode === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          dispatch(push("/login"));
          dispatch({
            type: actionTypes.LOGIN_FAILURE,
            error
          });
          return;
        }

        let errorData = error.response ? error.response.data : error;
        dispatch(failure(errorData.message));
      });
  };
  function request() {
    return { type: actionTypes.PROFILEINFO_REQUEST };
  }
  function success(profile) {
    return { type: actionTypes.PROFILEINFO_SUCCESS, profile };
  }
  function failure(error) {
    return { type: actionTypes.PROFILEINFO_FAILURE, error };
  }
}
