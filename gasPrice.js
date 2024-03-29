const { default: axios } = require("axios")

const run=async (userOp)=>{
const url=proccess.env.BUNDLER_URL

const data=
{
  "method": "eth_estimateUserOperationGas",
  "params": [
    {
      "sender":userOp.sender,
      "nonce":userOp.nonce ,
      "initCode":userOp.initCode ,
      "callData":userOp.callData ,
      "signature":userOp.signature ,
      "paymasterAndData":'0x' 
    },
    "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"
  ],
  "id": 1697033406,
  "jsonrpc": "2.0"
}

try{
    const result=await axios.post(url,data)
    return result.data.result
} catch (error) {
    return error.response
  

}


}

module.exports=run
