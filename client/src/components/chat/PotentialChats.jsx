import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
    const {user} = useContext(AuthContext)

    const {potentialChats, createChat, onlineUsers} = useContext(ChatContext)
    //console.log("PotentialChats", potentialChats)

    return(<>
    <div className="all-users">
        {potentialChats && potentialChats.map((u, index)=>{
            return (<div className="single-user" key={index} onClick={()=>createChat(user._id, u._id)}>
                {u.name} 
                <span className={

                    //means its recieving array from onlineUsers, so it will check if in any potential user in 'u' is  onlineUser then make use of user-online
                    onlineUsers?.some((user)=>user?.userId === u?._id )?"user-online":""}> </span>
            </div>);
            
        })}
    </div>
    </>
  );
}
 
export default PotentialChats;