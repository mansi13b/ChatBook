//http post and get 
export const baseUrl ="http://localhost:5000/api"

export const postRequest = async(url, body)=>{
    const response = await fetch(url,{
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body
    })

    const data = await response.json();
    if(!response.ok){

        let message;
        if(data?.message)
        {
            message = data.message
        }
        else{
            //our custom messages 
            message = data
        }
        return {error: true,message};
    }
    return data;
}


//GET
export const getRequest = async(url)=>{
  const response=  await fetch(url)
  const data = await response.json()
  if(!response.ok){
    let message="error occured";
     if(data?.message)
     {
        message = data.message
     }
     return {
        error: true, message
    }
   
  }
   return data
}