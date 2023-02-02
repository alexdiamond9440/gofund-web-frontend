import { combineReducers } from 'redux';
import { signUpReducer } from './signupReducer';
import { LoginReducer } from './LoginReducer';
import { ProfileReducer } from "./ProfileReducer";
import {reducer as toastrReducer} from 'react-redux-toastr'

const rootReducer = combineReducers({
    signUpReducer,
    LoginReducer,
    ProfileReducer,
    toastr: toastrReducer
});

export default rootReducer;