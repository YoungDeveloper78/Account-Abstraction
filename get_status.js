
const { default: axios } = require("axios")

const run=async (hash)=>{
    
const url=proccess.env.BUNDLER_URL

const data={
  "method": "eth_getUserOperationByHash",
  "params": [
    hash
  ],
  "id": 1693369916,
  "jsonrpc": "2.0"
}


try{
    const result=await axios.post(url,data)
    console.log(result);
    return result
} catch (error) {
    return error.response.data
}


}
module.exports=run

