import { createContext, useCallback, useEffect, useState } from "react";
// import { registerUser } from "../../../server/Controllers/userController";
import { baseUrl, postRequest } from "../utils/services";
//import Register from "../pages/Register";

export const AuthContext  = createContext()

export const AuthContextProvider = ({children}) =>{
    const [user, setUser] = useState(null);

    //to check any error while submitting the registration
    const [registerError, setRegisterError]= useState(null);
    //to check if we clicked register buttopn
    const [isRegisterLoading, setisRegisterLoading]= useState(false);
    //to keep updating register fields : name, email, password
    const [registerInfo, setRegisterInfo] = useState({
        name:"",
        email:"",
        password:""
    });

    console.log("user:", user); // to get user from localstorage
   
    useEffect(()=>{
        const user = localStorage.getItem("User");
        setUser(JSON.parse(user))
    },[])

    const registerUser = useCallback(async(e)=>{

        //to prevent form from refreshing
        e.preventDefault();
        setisRegisterLoading(true)
        setRegisterError(null)
        const response = await postRequest(
            `${baseUrl}/users/register`, JSON.stringify(registerInfo)
            )
        setisRegisterLoading(false)
        if(response.error)
        {
            return setRegisterError(response);
        }

        //to save user in localstorage
        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)
    },[registerInfo])
    console.log("registerInfo",registerInfo);
    //to save reigster entries

    const updateRegisterInfo = useCallback((info)=>{
        setRegisterInfo(info);
    },[]);

    //for login user
    const [loginError, setLoginError]= useState(null);
    const [isLoginLoading, setisLoginLoading]= useState(false); 
    const [loginInfo, setLoginInfo] = useState({
        email:"",
        password:""
    });
    console.log("loginInfo:", loginInfo);
    const updateLoginInfo = useCallback((info)=>{
        setLoginInfo(info);
    },[]);

    const loginUser =  useCallback(async(e)=>{

        e.preventDefault();
        setisLoginLoading(true)
        setLoginError(null)

        const response = await postRequest(
            `${baseUrl}/users/login`, JSON.stringify(loginInfo)
        );
          setisLoginLoading(false)
        if(response.error )
        {
            return setLoginError(response)
        }
        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)
      
    },[loginInfo])
              

    //for logout user
    const logoutUser= useCallback(()=>{
        localStorage.removeItem("User");
        setUser(null)

    },[])


    return <AuthContext.Provider value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading,
    }}>

    {children}
    </AuthContext.Provider>
}