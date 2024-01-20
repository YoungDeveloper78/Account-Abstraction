const { default: axios } = require("axios")

const run=async (userOp)=>{
const url="https://bundler.biconomy.io/api/v2/137/wde62ibhs.HI7fopYh-iJkl-12Io-af80-dsh90f74b78Cv"

const data={
  "method": "eth_sendUserOperation",
  "params": [
    {
      sender:userOp.sender,
      nonce:userOp.nonce,
      initCode:userOp.initCode,
      callData:userOp.callData,
      maxFeePerGas:userOp.maxFeePerGas,
      maxPriorityFeePerGas:userOp.maxPriorityFeePerGas,
      verificationGasLimit:userOp.verificationGasLimit,
      callGasLimit:userOp.callGasLimit,
      preVerificationGas:userOp.preVerificationGas,
      paymasterAndData:userOp.paymasterAndData,
      signature:userOp.signature,
    },
    "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
    {
      "simulation_type": "validation"
    }
  ],
  "id": 1697033407,
  "jsonrpc": "2.0"
}


try{
    const result=await axios.post(url,data)
    return result.data.result
} catch (error) {
    return error.response.data
}


}

module.exports=run
