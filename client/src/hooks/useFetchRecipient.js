import { useEffect, useState} from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat,user) =>{

    const [recipientUser, setRecipientUser] = useState(null)
    const [error, setError] = useState(null)
   
    //find id inside member which is not equal to userId , that'll be 2nd user id
    const recipientId = chat?.members?.find((id)=>id!== user?._id)
    console.log("recipientId, chatmembers",recipientId, chat?.members);

    useEffect(()=>{
        
        const getUser = async()=>{

            if(!recipientId)    return null;
            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
            if(response.error)
            {
                return setError(error)
            }
            setRecipientUser(response);
            console.log("response",response);
        }
        getUser()
    },[recipientId]);

    return {recipientUser}
};