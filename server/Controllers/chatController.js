const chatModel = require("../Models/chatModel")
//create chat
const createChat = async(req, res)=>{
    const {firstId, secondId} = req.body
    try{

        //if chat already exist

        const chat = await chatModel.findOne({
            //as Chatschema only have membbers so search among All and find both 1st and 2nd id
            members: {$all:[firstId, secondId]}
        })
        if(chat)    return res.status(200).json(chat);
        //if chat doesn't exist
        const newChat = new chatModel({
            members:[firstId, secondId]
        })
        const response = await newChat.save()
        res.status(200).json(response)
        
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}


//getUserChats
const findUserChats = async(req, res)=>{

    //we'll be giving userId from url
    const userId = req.params.userId

    try{

        const chats = await chatModel.find({
            members:{$in:[userId]}
        })

        res.status(200).json(chats)

    }catch(error){
        res.status(500).json(error)
    }

}




//findChat
const findChat = async(req, res)=>{

    //from url prarms we will get 1st and 2nd id of users
    const {firstId, secondId}= req.params;
    try{
        const chats = await chatModel.findOne({
            members: {$all: [firstId, secondId]}
        })
        res.status(200).json(chats)
    }
    catch(error){
        res.status(500).json(error)
    }


}


module.exports = {createChat, findUserChats, findChat};