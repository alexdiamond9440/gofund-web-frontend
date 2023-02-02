import { actionTypes } from "./../actions/actionTypes";

const initialState = {
	isSigningUp: false,
	user: '',
	error:''
}

export const signUpReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.SIGNUP_REQUEST:
			return {
				...state,
				isSigningUp: true
			};
		case actionTypes.SIGNUP_SUCCESS:
			return {
				...state,
				isSigningUp: false,
				user: action.user
			};
		case actionTypes.SIGNUP_FAILURE:
			return {
				...state,
				isSigningUp: false,
				error:action.error
			};
		default:
			return state
	}
}