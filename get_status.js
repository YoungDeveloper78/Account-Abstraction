
const { default: axios } = require("axios")

const run=async (hash)=>{
    
const url="https://bundler.biconomy.io/api/v2/137/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"

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

