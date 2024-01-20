const getGas = require('./gasPrice')
const paymasterMode = require('./paymasterMode')
const sendTx = require('./sendTx')
const getstatus = require('./get_status')
const { createPublicClient, http } = require('viem');
const {getUserOperationHash,getSenderAddress} = require('permissionless');
const {polygonMumbai} = require('viem/chains');
const abi = require('./erc20.json')
const smartAccountABI = require('./smartAccountAbi.json')
const ethers = require('ethers')
const SMART_ACCOUNT_ENTRY_POINT="0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const SMART_ACCOUNT_FACTORY_ADDRESS="0x00000055C0b4fA41dde26A74435ff03692292FBD"
const SMART_ACCOUNT_PROVIDER="https://rpc.ankr.com/polygon"
 require('dotenv')
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);


/**
 * Asynchronous function to create a smart account.
 *
 * @param {string} walletAddress - The wallet address for the new smart account.
 * @returns {Promise<void>} - A Promise indicating the completion of the smart account creation.
 */
async function createSmartAccount(walletAddress) {
  
    const entryPoint = SMART_ACCOUNT_ENTRY_POINT;
    const factoryAddress = SMART_ACCOUNT_FACTORY_ADDRESS;
    const chain = polygonMumbai;

    const publicClient = createPublicClient({
      transport: http(SMART_ACCOUNT_PROVIDER),
      chain,
    });

    const factoryInterface = new ethers.utils.Interface([
      {
        inputs: [
          { name: "owner", type: "address" },
          { name: "salt", type: "uint256" },
        ],
        name: "createAccount",
        outputs: [{ name: "ret", type: "address" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ]);

    const encodedFunctionData = factoryInterface.encodeFunctionData(
      "createAccount",
      [walletAddress, 0]
    );
    const initCode = factoryAddress + encodedFunctionData.substring(2);
    const smartWalletAddress = await getSenderAddress(publicClient, {
      initCode,
      entryPoint,
    });

    return {smartWalletAddress,initCode}
}
/**
 * Asynchronous function to create a smart transaction.
 *
 * @param {string} walletAddress - The wallet address initiating the transaction.
 * @param {object[]} contracts - Array of contract instances involved in the transaction.
 * @param {string[]} functions - Array of function names to be called on the contracts.
 * @param {string[]} functionsData - Array of data for each function call.
 * @param {string[]} values - Array of values associated with each function call.
 * @returns {Promise<void>} - A Promise indicating the completion of the transaction creation.
 */
async function createSmartTransaction(

  walletAddress,
  contracts,
  functions,
  functionsData,
  values
) {
    
  
    let {smartWalletAddress,initCode}=await createSmartAccount(walletAddress)
    const entryPoint = SMART_ACCOUNT_ENTRY_POINT;

    const factoryInterface = new ethers.utils.Interface(abi);
    // const contract = new ethers.Contract(smartWalletAddress, smartAccountABI, provider);
    const smartAccount = new ethers.Contract(smartWalletAddress, smartAccountABI, provider);

    let mode="ERC20"

    let nonce="0x0"
    try{
      nonce = "0x" + Number(await smartAccount.getNonce()).toString(16);
      console.log(nonce);
      initCode="0x"
      
    }
    catch{
    mode="SPONSORED"
        
    }
    console.log(Number(await smartAccount.getNonce()).toString(16));
    const account = new ethers.utils.Interface([
      "function executeBatch(address [] dest,uint [] values ,bytes [] func)",
    ]);
    let encodedFunctionDataArray = [];
    let counter = 0;
    for (var item of functions) {
      const result = factoryInterface.encodeFunctionData(
        item,
        functionsData[counter]
      );
      encodedFunctionDataArray.push(result);
      counter++;
    }
//     // console.log(contracts);
    const callData = account.encodeFunctionData("executeBatch", [
      contracts,
      values,
      encodedFunctionDataArray,
    ]);


    let userOperation = {
      sender: smartWalletAddress,
      nonce: nonce,
      initCode,
      callData,
      signature:
        "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
    };
// console.log(userOperation);
    const dataGas = await getGas(userOperation);
    // console.log(dataGas);
    console.log("dataGas: ", dataGas);
    userOperation = { ...userOperation, ...dataGas };

    userOperation.callGasLimit = Number(userOperation.callGasLimit).toString();
    userOperation.verificationGasLimit = Number(
      userOperation.verificationGasLimit
    ).toString();
    userOperation.preVerificationGas = Number(
      userOperation.preVerificationGas
    ).toString();
    
    const paymasterAndData = await paymasterMode(userOperation, mode);
    userOperation = {
      ...userOperation,
      ...paymasterAndData,
    };
    console.log("paymasterAndData: ", paymasterAndData);
    userOperation.callGasLimit = Number(userOperation.callGasLimit).toString();
    userOperation.verificationGasLimit = Number(
      userOperation.verificationGasLimit
    ).toString();
    userOperation.preVerificationGas = Number(
      userOperation.preVerificationGas
    ).toString();
    userOperation.maxPriorityFeePerGas = Number(
      userOperation.maxPriorityFeePerGas
    ).toString();
    userOperation.maxFeePerGas = Number(userOperation.maxFeePerGas).toString();
    console.log("userOperation: ", userOperation);
    const hash = getUserOperationHash({
      userOperation,
      entryPoint,
      chainId: 137,
    });

    const data = {
      userOperationObject: userOperation,
      operationHash: hash,
    };
    return data;
}


const run=async ()=>{
const privateKey="process.env.PROVIDER"
const wallet=new ethers.Wallet(privateKey,provider)
/*
 *
 * @param {string} walletAddress - The wallet address initiating the transaction.
 * @param {object[]} contracts - Array of contract instances involved in the transaction.
 * @param {string[]} functions - Array of function names to be called on the contracts.
 * @param {string[]} functionsData - Array of data for each function call.
 * @param {string[]} values - Array of values associated with each function call.
 * @returns {Promise<void>} - A Promise indicating the completion of the transaction creation.
 */

const data=await createSmartTransaction(wallet.address,["0xc2132D05D31c914a87C6611C10748AEb04B58e8F"],["approve"],[["0x01E1CF234f6766Be0764e731A60D2cCb08c879a4","1000000"]],[0])
data.userOperationObject.signature=wallet.signMessage(data.operationHash)
const tx=await sendTx(data.userOperationObject)

const result=getstatus(tx)


}

run()
