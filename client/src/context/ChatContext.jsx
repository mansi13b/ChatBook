import { createContext, useState, useEffect, useCallback } from "react";
import { getRequest,baseUrl,postRequest } from "../utils/services";
import {io} from "socket.io-client";
export const ChatContext = createContext();

export const ChatContextProvider = ({children, user})=>{
      
    const [userChats, setUserChats] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
    const [userChatsError, setUserChatsError] = useState(null)
    const [potentialChats,setPotentialChats] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [isMessageLoading, setIsMessageLoading] = useState(false)
    const [messageError, setMessageError] = useState(null)
    const [sendTextMessageError, setSendTextMessageError] = useState(null)
    const [newMessage, setNewMessage] = useState(null)
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const[notifications, setNotifications] = useState([]);
    const [allUsers, setAllUsers]= useState([])
    console.log("notifications",notifications)
    console.log("onlineUsers",onlineUsers)
    // console.log("message",messages)
    //initialize socket
    useEffect(()=>{
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket)

        //cleanup
        return ()=>{
            newSocket.disconnect()
        }
    },[user]);

    //add online users
    useEffect(()=>{
        if(socket === null) return
        socket.emit("addNewUser", user?._id)
        socket.on("getOnlineUsers",(res)=>{
            setOnlineUsers(res)
        })
        return  ()=>{
            socket.off("getOnlineUsers");

        };
    },[socket]);


    //send msg to server
    useEffect(()=>{
        console.log("socket value:", socket)
        if(socket === null) return;
        const recipientId = currentChat?.members?.find((id)=>id!== user?._id)
        console.log("recipientId value:", recipientId)

      socket.emit("sendMessage",{...newMessage, recipientId})
    },[newMessage]);  //newMessage-> socket server ->add it realtime


    //recieve messages and notifications
    useEffect(()=>{
        if(socket === null) return;

        socket.on("getMessage",res=>{
            if(currentChat?._id !== res.chatId) return
            setMessages((prev) =>[...prev, res])
        })
        socket.on("getNotification", (res)=>{
            //chat can be either in open or non open state
            const isChatOpen  = currentChat?.members.some(id =>id ===res.senderId)
            if(!isChatOpen)
            {setNotifications(prev=>[{...res, isRead: true},...prev])}
            else{
                setNotifications(prev => [res, ...prev])
            }
        })
        return ()=>{
            socket.off("getMessage")
            socket.off("getNotifications")
        }
    },[socket,currentChat])


    


    useEffect(()=>{
        const getUsers =async()=>
        {
            const response =await getRequest(`${baseUrl}/users/find`)
            if(response.error)
            {
                return console.log("error fetching users", response)
            }
          
            //pChats is array of users whom we can start a chat with
          const pChats=  response.filter((currentUser)=>{  
            let isChatCreated =false;
            //exclude current user
            if (!user || user._id == currentUser._id)
            {
                return false
            }

            //if userChat exists
            if(userChats)
            {
                isChatCreated = userChats?.some((chat)=>{
                    return chat.members[0] === currentUser._id  || chat.members[1] === currentUser._id //means we have a chat so isChat wull be true
                })
            }

            return !isChatCreated

            });

            setPotentialChats(pChats)
            setAllUsers(response)
        };
        getUsers()
    },[userChats])

    useEffect(()=>{

        const getUserChats= async()=>{
            if(user?._id)
            {
                setIsUserChatsLoading(true)
                setUserChatsError(null)
                const response =await getRequest(`${baseUrl}/chats/${user?._id}`)
                setIsUserChatsLoading(false)
                if(response.error)
                {
                    return setUserChatsError(response)
                }
                setUserChats(response)
            }
        }
        getUserChats()
    },[user, notifications])

    //click on progfile and get message
    useEffect(()=>{

        const getMessages= async()=>{

                setIsMessageLoading(true)
                setMessageError(null)
                const response =await getRequest(`${baseUrl}/messages/${currentChat?._id}`)
                setIsMessageLoading(false)
                if(response.error)
                {
                    return setMessageError(response)
                }
                setMessages(response)
            
        }
        getMessages()
    },[currentChat])

    //to send text msg after clicking button from screen
    const sendTextMessage = useCallback(async(textMessage,sender, currentChatId, setTextMessage)=>{

        if(!textMessage)
        {
            return console.log("type a message.....")
        }

        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage
        }));
        if(response.error)
        {
            return setSendTextMessageError(response)
        }
        setNewMessage(response)
        setMessages((prev)=> [...prev,response])
        setTextMessage("")
    },[])
    //update current chat
    const updateCurrentChat = useCallback((chat)=>{
        setCurrentChat(chat)
    },[])

    //to create chat on clicking
    const createChat = useCallback(async(firstId, secondId)=>{
        const response =await postRequest(`${baseUrl}/chats`, JSON.stringify({
            firstId,secondId
        }))
        if(response.error)
        {
            return console.log("error creating chat", response)
        }
        setUserChats((prev)=>[...prev, response]);
    },[])

    //mark all notifications as read
    const markAllNotificationsAsRead = useCallback((notifications)=>{
        const mNotifications = notifications.map((n)=> {
        return {...n,isRead:true}
         } )
         setNotifications(mNotifications);
    },[])
    
//mark notification clicked on as read
    const markNotificationAsRead = useCallback((n, userChats,user,notifications)=>{

        // find chat to open
        const desiredChat = userChats.find((chat) =>{
            const chatMembers = [user._id,n.senderId]
            const isDesiredChat = chat?.members.every((member)=>{
                return chatMembers.includes(member);
            })
            return isDesiredChat;
        });

        //mark notification as read
        const mNotifications  = notifications.map(el=>{

            if(n.senderId=== el.senderId)
            {
                return {...n, isRead:true}
            }
            else{
                return el
            }
        })
        updateCurrentChat(desiredChat)

        setNotifications(mNotifications)
    },[])

    const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notifications)=>{
        const mNotifications = notifications.map(el=>{
            let notification;
            thisUserNotifications.forEach(n=>{
            if(n.senderId ===el.senderId)
              {  notification ={...n, isRead:true}
              }
              else{
                notification = el
              }
            })
            return notification
        })
        setNotifications(mNotifications)
    },[])
    return (<ChatContext.Provider value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessageLoading,
        messageError,
        currentChat,
        sendTextMessage,
        sendTextMessageError,
        onlineUsers,
        newMessage,
        notifications,
        allUsers, 
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead,

    }}>{children}</ChatContext.Provider>
    ); 
};