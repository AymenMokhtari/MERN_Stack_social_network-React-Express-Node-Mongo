import { GET_ERRORS,SET_CURRENT_USER } from "./types";
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwtdecode from 'jwt-decode'

//  Register 
export  const  registerUser =(userData , history) =>dispatch  => {
    axios
        .post('/api/users/register', userData)
        .then(res => history.push('./login'))
        .catch(err=> dispatch({
            type:GET_ERRORS ,
            payload : err.response.data
    }))

};


// Login get user token
export const loginUser = (userData)  => dispatch => {
 
    axios
        .post('/api/users/login', userData)
        .then(res => {
           
            //save to local storage
            const { token } = res.data;

            // Set token to ls
            localStorage.setItem('jwtToken' , token)  ;
     
            // set Token to auth header
            setAuthToken(token);
  
            // decode token to get user data

            const decoded = jwtdecode(token);
     
            //Set current user

            dispatch(setCurrentUser(decoded)) ;
            console.log("6");


        })
        .catch(err => 
            dispatch ({
                type:GET_ERRORS,
                payload : err.response.data
            }) )


    
};

// Set current user

export const setCurrentUser = (decoded) => {
    return      {
        type:SET_CURRENT_USER ,
        payload : decoded
    };

};


// Log user out 
export const logoutUser  = () => dispatch => {
    //Remove token from localstorag
    localStorage.removeItem('jwtToken') ; 


    //Remove auth header from future request 

    setAuthToken(false);

    //Set curernt user to {} wich also set authenitificated to false 

    dispatch(setCurrentUser({}));


}


