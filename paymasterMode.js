
const { default: axios } = require("axios");

const run = async (userOp, mode) => {
  const url =
    "https://paymaster.biconomy.io/api/v1/137/MGLF2k_X7.b9311c33-b64a-4c76-b918-87dc1c23d372";

  if (mode === "SPONSORED") {
    console.log(`mode SPONSORED`);
    const data = {
      method: "pm_getFeeQuoteOrData",
      params: [
        {
          sender: userOp.sender,
          nonce: userOp.nonce,
          initCode: userOp.initCode,
          callData: userOp.callData,
          signature: userOp.signature,
          callGasLimit: userOp.callGasLimit,
          verificationGasLimit: userOp.verificationGasLimit,
          preVerificationGas: userOp.preVerificationGas,
          maxPriorityFeePerGas: userOp.maxPriorityFeePerGas,
          maxFeePerGas: userOp.maxFeePerGas,
        },
        {
          mode: "SPONSORED",
          calculateGasLimits: true,

          sponsorshipInfo: {
            webhookData: {},
            smartAccountInfo: {
              name: "BICONOMY",
              version: "2.0.0",
            },
          },
        },
      ],
      id: 1,
      jsonrpc: "2.0",
    };

    try {
      const result = await axios.post(url, data);
      return result.data.result;
    } catch (error) {
      console.log("Error in paymasterMode: ", error.response.data);
      return error.response.data;
    }
  } else {
    console.log(`mode ERC20`);
    const data = {
      method: "pm_sponsorUserOperation",
      params: [
        {
          sender: userOp.sender,
          nonce: userOp.nonce,
          initCode: userOp.initCode,
          callData: userOp.callData,
          maxFeePerGas: userOp.maxFeePerGas,
          maxPriorityFeePerGas: userOp.maxPriorityFeePerGas,
          verificationGasLimit: userOp.verificationGasLimit,
          callGasLimit: userOp.callGasLimit,
          preVerificationGas: userOp.preVerificationGas,
          paymasterAndData: userOp.paymasterAndData,
          signature: userOp.signature,
        },
        {
          calculateGasLimits: true,
          mode: "ERC20",
          tokenInfo: {
            feeTokenAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
          },
        },
      ],
      id: 14,
      jsonrpc: "2.0",
    };

    try {
      const result = await axios.post(url, data);
      return result.data.result;
    } catch (error) {
      console.log("Error in paymasterMode: ", error.response.data);
      return error.response.data;
    }
  }
};

module.exports = run;
