const Web3 = require('web3');
const Common = require('ethereumjs-common').default;
const Tx = require('ethereumjs-tx').Transaction;
var utils = require('utils')._;
const BigNumber = require('bignumber.js');
require('dotenv').config();
////console.log('process.env.RPC_URL ' , process.env.RPC_URL)
const ethers = require('ethers');
// const sepoliaNodeEndpoint = process.env.RPC_URL;
// // const web3 = new Web3(new Web3.providers.HttpProvider(sepoliaNodeEndpoint));
// // web3.eth.net.isListening()
// //     .then(() => //console.log(`Connected to Sepolia ETH network at ${sepoliaNodeEndpoint}`))
// //     .catch((error) => console.error(`Error connecting to Sepolia ETH network: ${error}`));
// // const contractAddress= process.env.CONTRACT_ADDRESS;

const generateBnbAddress = async ()=>{
    const web3 = new Web3(process.env.RPC_URL);
    const newAccount = web3.eth.accounts.create();
    ////console.log(newAccount)
    const account =  {
        address: newAccount.address,
        private_key: newAccount.privateKey,
    };  
    ////console.log("newAccount",newAccount);
    return account;
}


const bnbBalance = async (address) => {

    try{ 
        ////console.log("(process.env.RPC_URL----",process.env.RPC_URL)
        const web3 = new Web3(process.env.RPC_URL); 
        let balance =  await web3.eth.getBalance(address);
        ////console.log("balance---", balance)
        return web3.utils.fromWei(balance, 'ether');
        // res.status(200).send({ success: 1,status : 'success',balance: balance}); 
      }catch(err){ 
        ////console.log(err)
        return err
        // res.status(200).send({ success: 0,status : 'fail',message: err});
      } 
}




const bep_token_transfer = async (privateKey ,WalletFrom ,reciverAddress , amount , decimals) =>{ 
////console.log(WalletFrom , ' walletfrom ' , reciverAddress , amount)
        const BSC_MAIN = Common.forCustomChain('mainnet', {
                name: 'bnb',
                networkId: process.env.NETWORK_ID,
                chainId: process.env.CHAIN_ID
            },'petersburg')
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL), null, { timeout: 100000000}); 
        let bep20AbiJson = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"},{"name":"amount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"listAddress","type":"address"},{"name":"isBlackListed","type":"bool"}],"name":"blackListAddress","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint256"},{"name":"_supply","type":"uint256"},{"name":"tokenOwner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"blackListed","type":"address"},{"indexed":false,"name":"value","type":"bool"}],"name":"Blacklist","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
         
        var count = await web3.eth.getTransactionCount(WalletFrom);
          // get contract
        try{
            
            var contract = new web3.eth.Contract(bep20AbiJson, contractAddress); 
            var contractName = await contract.methods.name().call();  
            // let transferAmount = amount * (Math.pow(10, decimals));
            // transferAmount = web3.utils.toHex(new BigNumber(transferAmount)).toString()  
            // let gasTransferAmount = amount * 100000000000000000
            let transferAmount = web3.utils.toWei(amount.toString(), "ether");
            // transferAmount = transferAmount * 1000;
            ////console.log(contractName,'gasTransferAmount ' ,transferAmount)
            try{
                
              var dataVal = contract.methods.transfer(reciverAddress, web3.utils.toHex(transferAmount.toString())).encodeABI();
              
                try{
                  var resultgas = await web3.eth.estimateGas({
                    from: WalletFrom,
                    to: contractAddress,
                    data: dataVal
                  });
                  ////console.log('near about ' ,resultgas )
                }catch(e){
                  ////console.log('eee ' , e)
                }
                
              // ////console.log(dataVal)
              ////console.log(' gas Limit ', resultgas);
              var block = await web3.eth.getBlock("latest");
              var gasLimit = block.gasLimit;
              ////console.log('gasLimit  ', gasLimit);
              var gasPrice = await web3.eth.getGasPrice(function (error, result) {
                ////console.log('gasPrice', result);
                return result;
          
                // var gasPriceInGwei = web3.utils.fromWei(result, 'gwei');
                // ////console.log(gasPriceInGwei);
              });
              
                const rawTransaction = {
                    from: WalletFrom,
                    nonce: "0x" + count.toString(16),
                    to: contractAddress,
                    gasLimit: web3.utils.toHex(resultgas),
                    gasPrice: web3.utils.toHex(gasPrice),
                    data: dataVal,
                }
                 ////console.log('rrrr  ',rawTransaction);
                var tx = new Tx(rawTransaction, { common: BSC_MAIN });
                // ////console.log('generated key'  , web3.utils.hexToBytes(privateKey))
                // return;
                privateKey = privateKey.substring(2)
                 ////console.log('pvky ',privateKey);
                let privKey = Buffer.from(privateKey, 'hex');
                tx.sign(privKey);
                var serializedTx = tx.serialize();
                var rawTxHex = '0x' + serializedTx.toString('hex');
                
                try{
                    let transactionResponse = await web3.eth.sendSignedTransaction(rawTxHex)
                    .on('receipt', receipt => {
                        ////console.log('recipt is ' ,receipt);
                        // res.status(200).send({ success: 1,status : 'success',receipt: receipt});
                        // return ({ success: 1,status : 'success' , receipt : receipt});
                    }).then((resp) => {
                        ////console.log('inside success' , resp);
                        // return({ success: 1,status : 'success' , receipt : resp});
                        res.status(200).send({ success: 1,status : 'success',receipt: resp});
                        // success
                    }).catch((err) => {
                        ////console.log('fail 2 here ',err);
                        // return({ success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'});
                        // res.status(200).send({ success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'});
                        // return({ success: 0,status : 'fail',message: 'Please Deposit Some BNB for Gas Fee'});
                        // fail
                    });
                    // return transactionResponse;
                }catch(err){
                    ////console.log('outter fail',err);
                    // res.status(200).send({ success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'});
                    return({ success: 0,status : 'fail',message: err});
                }
                
            }catch(error){
                ////console.log('error 1',error);
                return({ success: 0,status : 'fail',message:error + ' '});
                // res.status(200).send({ success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'});
            }
        }catch(err){
            ////console.log('contract error ' ,err)
            return({ success: 0,status : 'fail',message: err});
            // res.status(200).send({ success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'});
        } 
}

const transfer_new_bep20_token = async (WalletFrom, privateKey, reciverAddress , amount , contractAddress , decimals = 18) => {

  // const wallet = new ethers.Wallet(privateKey);
  // //console.log(privateKey,'inside private key '  ,WalletFrom )
  // return;
  const BSC_MAIN = Common.forCustomChain('mainnet', {
      // name: 'ETH',
      networkId: process.env.NETWORK_ID,
      chainId: process.env.CHAIN_ID
  },'petersburg')
  const web3 = new Web3(process.env.RPC_URL); 


  let contractAbi = [{"inputs":[{"internalType":"string","name":"_tokenName","type":"string"},{"internalType":"string","name":"_tokenSymbol","type":"string"},{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"sale","type":"string"},{"indexed":true,"internalType":"uint256","name":"supply","type":"uint256"},{"indexed":true,"internalType":"address","name":"walletAddress","type":"address"}],"name":"MintedWalletSuupply","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"saleId","type":"uint8"},{"internalType":"address","name":"saleAddress","type":"address"}],"name":"changeMintedSaleAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"saleName","type":"string"}],"name":"getAssignedWalletAndSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestSale","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMaxSupply","outputs":[{"internalType":"uint160","name":"","type":"uint160"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"mintedSale","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint160","name":"supply","type":"uint160"},{"internalType":"address","name":"walletAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintingCounter","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  let final_response;
  var count = await web3.eth.getTransactionCount(WalletFrom);
  
  try{
      var contract = new web3.eth.Contract(contractAbi, contractAddress); 
      var contractName = await contract.methods.name().call();
      var decimals = await contract.methods.decimals().call();
      
      // return;
      var balanceis = await contract.methods.balanceOf(WalletFrom).call();
      //console.log('reached here successfully',contractName , 'balanceis ' , balanceis)
      // let balanceOf = await contract.methods.balanceOf(WalletFrom).cal();  
      let transferAmount = amount * (Math.pow(10, decimals));



      web3.eth.getTransactionCount(WalletFrom, 'pending')
      .then((nonce) => {
          // Build the raw transaction object
          const rawTransaction = {
              from: WalletFrom,
              to: contractAddress,
              gas: 200000, // Adjust gas limit according to your needs
              gasPrice: web3.utils.toWei('10', 'gwei'), // Adjust gas price accordingly
              nonce: nonce,
              data: contract.methods.transfer(reciverAddress, amount).encodeABI(),
          };
  
          // Estimate gas and update the gas limit
              web3.eth.estimateGas(rawTransaction)
              .then((gasEstimate) => {
                  rawTransaction.gas = gasEstimate;
  
                  // Sign and send the transaction
                  const signedTransaction = web3.eth.accounts.signTransaction(rawTransaction, privateKey);
  
                  web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
                      .on('transactionHash', (txHash) => {
                          //console.log('Transaction sent. TxHash:', txHash);
                      })
                      .on('confirmation', (confirmationNumber, receipt) => {
                          //console.log('Confirmation Number:', confirmationNumber);
                          //console.log('Receipt:', receipt);
                      })
                      .on('error', (error) => {
                          console.error('Transaction Error:', error.message || error);
                      });
              })
              .catch((error) => {
                  console.error('Error estimating gas:', error.message || error);
              });
      })
      .catch((error) => {
          console.error('Error getting nonce:', error.message || error);
      });


      
      // //console.log(decimals + 'transfer amount is ' + transferAmount)
      // transferAmount = web3.utils.toHex(new BigNumber(transferAmount)).toString()  
      // let gasTransferAmount = amount * 100000000000000000
      
      // try{
        
      //     // //console.log('gasTransferAmount ' ,gasTransferAmount)
      //     var dataVal = contract.methods.transfer(reciverAddress, web3.utils.toHex(transferAmount.toString())).encodeABI();
      //     var resultgas = await web3.eth.estimateGas({
      //         from: WalletFrom,
      //         to: contractAddress,
      //         data: dataVal
      //     });
      //     // //console.log(' gas Limit ', resultgas);
      //     var block = await web3.eth.getBlock("latest");
      //     var gasLimit = block.gasLimit;
      //     // //console.log('gasLimit  ', gasLimit);
      //     var gasPrice = await web3.eth.getGasPrice(function (error, result) {
      //         //console.log('gasPrice', result);
      //         return result;
      
      //         // var gasPriceInGwei = web3.utils.fromWei(result, 'gwei');
      //         // //console.log(gasPriceInGwei);
      //     });
          
      //     const rawTransaction = {
      //         from: WalletFrom,
      //         nonce: "0x" + count.toString(16),
      //         to: contractAddress,
      //         gasLimit: web3.utils.toHex(resultgas),
      //         gasPrice: web3.utils.toHex(gasPrice),
      //         data: dataVal,
      //     }
      //     // //console.log('rrrr  ',rawTransaction);
      //     var tx = new Tx(rawTransaction, { common: BSC_MAIN });
          
      //     privateKey = privateKey.substring(2)
      //     //31dad32ba952917d9704238c7cdb9baa20749bfcb0b903236ca4e0cdb70b2642
      //     //31dad32ba952917d9704238c7cdb9baa20749bfcb0b903236ca4e0cdb70b2642
      //     //console.log('  ---------  with balance' + amount  , contractName , balanceis ,'privateKey', privateKey )
      //     let privKey = Buffer.from(privateKey, 'hex');
          
      //     tx.sign(privKey);
      //     var serializedTx = tx.serialize();
      //     var rawTxHex = '0x' + serializedTx.toString('hex');
      //     //console.log('pvky ',rawTxHex);
      //     try{
              
      //        let resp =  await web3.eth.sendSignedTransaction(rawTxHex).on('receipt', receipt => {
      //             //console.log('case 1' , receipt);
      //             final_response = { success: 1,status : 'success',receipt : receipt};
                 
      //         }).then((receipt) => {
      //             //console.log('case 2' , receipt);
      //             final_response = { success: 1,status : 'success',receipt : receipt};
      //             // success
      //             return final_response;
      //         }).catch((err) => {
      //             // //console.log('fail 2',err);
      //             //console.log('case 3' ,err);
      //             final_response = { success: 0,status : 'fail',err : err , message: 'insufficient funds for gas * price + value'};
      //             return final_response;
      //             // fail
      //         });
      //         return resp;
              
      //     }catch(err){
      //         //console.log('case 4');
      //         // //console.log('outter fail',err);
      //         return({ success: 0,status : 'fail',message: err});
      //     }
          
      // }catch(error){
      //     //console.log('error 5',error);
      //     return({ success: 0,status : 'fail',message: error.reason});
      // }
  }catch(err){
      //console.log('contract error 6' ,err)
      return({ success: 0,status : 'fail',message: err});
  } 
} 


let get_past_transactions = async() => {
  const Web3 = require('web3');
  const web3 = new Web3(process.env.RPC_URL);
  const tokenContractABI = [{"inputs":[{"internalType":"string","name":"_tokenName","type":"string"},{"internalType":"string","name":"_tokenSymbol","type":"string"},{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"sale","type":"string"},{"indexed":true,"internalType":"uint256","name":"supply","type":"uint256"},{"indexed":true,"internalType":"address","name":"walletAddress","type":"address"}],"name":"MintedWalletSuupply","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"saleId","type":"uint8"},{"internalType":"address","name":"saleAddress","type":"address"}],"name":"changeMintedSaleAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"saleName","type":"string"}],"name":"getAssignedWalletAndSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestSale","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMaxSupply","outputs":[{"internalType":"uint160","name":"","type":"uint160"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"mintedSale","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint160","name":"supply","type":"uint160"},{"internalType":"address","name":"walletAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintingCounter","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  const tokenContract = new web3.eth.Contract(tokenContractABI, process.env.CONTRACT_ADDRESS);
  tokenContract.getPastEvents('Transfer', {
      filter: {
          $or: [
              { from: process.env.ANRYTON_HOT_WALLET_ADDRESS },
              { to: process.env.ANRYTON_HOT_WALLET_ADDRESS }
          ]
      },
      fromBlock: 0,
      toBlock: 'latest'
  })
  .then((events) => {
      // Print the list of ERC-20 token transfer events
      //console.log('ERC-20 Token Transfer Events:');
      events.forEach((event) => {
          //console.log('Transaction Hash:', event);
          // //console.log('Transaction Hash:', event.transactionHash);
          // //console.log('From:', event.returnValues.from);
          // //console.log('To:', event.returnValues.to);
          // //console.log('Value:', event.returnValues.value);
          //console.log('------------------------');
          // if(event.returnValues.from == process.env.ANRYTON_HOT_WALLET_ADDRESS){

          // }
      });
  })
  .catch((error) => {
      console.error('Error fetching ERC-20 token transactions:', error.message || error);
  });


}
get_past_transactions()
// let sale_owner = '0x2a92A54A5204Da4455A8cD887a49d523C1737785';
// let owner_private_key = 'b7d6e3403824f0a5a2e4eec3cc7e062a28291b9cddc85498453ca49b7af26a71';
// let stake_contract_address = '0x962c1499D4609bD60E170021Ba8474a0e3BdB90B';
// let deposit_address = '0xB893291440322576963c44e20586fE9957816Eba'
let transfer_token = async() =>{
  let resp = await transfer_new_bep20_token(
                '0xeF7f5b3675122345c518499b43fb21140d35d592',
                '0x31dad32ba952917d9704238c7cdb9baa20749bfcb0b903236ca4e0cdb70b2642'  , 
                reciverAddress ='0xB893291440322576963c44e20586fE9957816Eba',
                amount =13, 
                process.env.CONTRACT_ADDRESS,
                decimals = 18);
  //console.log('resp ' , resp)
}
// transfer_token()


// const bep_token_transfer = async (privateKey ,WalletFrom ,reciverAddress , amount , decimals) => {
//       ////console.log(WalletFrom , ' walletfrom ' , reciverAddress , amount , decimals)
//         const BSC_MAIN = Common.forCustomChain('mainnet', {
//                 name: 'bnb',
//                 networkId: process.env.NETWORK_ID,
//                 chainId: process.env.CHAIN_ID
//             },'petersburg')
//         const web3 = new Web3(process.env.RPC_URL); 
//         let bep20AbiJson = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"},{"name":"amount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"listAddress","type":"address"},{"name":"isBlackListed","type":"bool"}],"name":"blackListAddress","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint256"},{"name":"_supply","type":"uint256"},{"name":"tokenOwner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"blackListed","type":"address"},{"indexed":false,"name":"value","type":"bool"}],"name":"Blacklist","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];
//         var count = await web3.eth.getTransactionCount(WalletFrom);
//           // get contract
//         try{
            
//             var contract = new web3.eth.Contract(bep20AbiJson, contractAddress); 
//             var contractName = await contract.methods.name().call();  
//             let transferAmount = amount * (Math.pow(10, decimals));
//             // transferAmount = web3.utils.toHex(new BigNumber(transferAmount)).toString()  
//             // let gasTransferAmount = amount * 100000000000000000
//             // let transferAmount = web3.utils.toWei(amount.toString(), "lovelace");
//             // transferAmount = transferAmount * 1000;
//             ////console.log(contractName,'gasTransferAmount ' ,transferAmount)
//             try{
                
//               var dataVal = contract.methods.transfer(reciverAddress, web3.utils.toHex(transferAmount.toString())).encodeABI();
              
//                 try{
//                   var resultgas = await web3.eth.estimateGas({
//                     from: WalletFrom,
//                     to: contractAddress,
//                     data: dataVal
//                   });
//                   ////console.log('near about ' ,resultgas )
//                 }catch(e){
//                   ////console.log('eee ' , e)
//                 }
                
//               // ////console.log(dataVal)
//               ////console.log(' gas Limit ', resultgas);
//               var block = await web3.eth.getBlock("latest");
//               var gasLimit = block.gasLimit;
//               ////console.log('gasLimit  ', gasLimit);
//               var gasPrice = await web3.eth.getGasPrice(function (error, result) {
//                 ////console.log('gasPrice', result);
//                 return result;
          
//                 // var gasPriceInGwei = web3.utils.fromWei(result, 'gwei');
//                 // ////console.log(gasPriceInGwei);
//               });
              
//                 const rawTransaction = {
//                     from: WalletFrom,
//                     nonce: "0x" + count.toString(16),
//                     to: contractAddress,
//                     gasLimit: web3.utils.toHex(resultgas),
//                     gasPrice: web3.utils.toHex(gasPrice),
//                     data: dataVal,
//                 }
//                  ////console.log('rrrr  ',rawTransaction);
//                 var tx = new Tx(rawTransaction, { common: BSC_MAIN });
//                 // ////console.log('generated key'  , web3.utils.hexToBytes(privateKey))
//                 // return;
//                 privateKey = privateKey.substring(2)
//                 ////console.log("privateKey--", privateKey)
//                 // ////console.log('pvky ',privateKey);
//                 let privKey = Buffer.from(privateKey, 'hex');
//                 tx.sign(privKey);
//                 var serializedTx = tx.serialize();
//                 var rawTxHex = '0x' + serializedTx.toString('hex');
                
//                 try{
//                     let transactionResponse = await web3.eth.sendSignedTransaction(rawTxHex)
//                     .on('receipt', receipt => {
//                         ////console.log('recipt is ' ,receipt);
                        
//                         return ({ success: 1,status : 'success' , receipt : receipt});
//                     }).then((resp) => {
//                         ////console.log('inside success' , resp);
//                         return({ success: 1,status : 'success' , receipt : resp});
//                         // success
//                     }).catch((err) => {
//                         ////console.log('fail 2 here ',err);
//                         // return({ success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'});
//                         return({ success: 0,status : 'fail',message: 'Please Deposit Some BNB for Gas Fee'});
//                         // fail
//                     });
//                     return transactionResponse;
//                 }catch(err){
//                     ////console.log('outter fail',err);
//                     return({ success: 0,status : 'fail',message: err});
//                 }
                
//             }catch(error){
//                 ////console.log('error 1',error);
//                 return({ success: 0,status : 'fail',message:error + ' '});
//             }
//         }catch(err){
//             ////console.log('contract error ' ,err)
//             return({ success: 0,status : 'fail',message: err});
//         } 
// }

const bnb_transfer = async (myAddress ,privateKey ,amount ,to ) => {
    // ////console.log(myAddress , privateKey , 'amount ' , amount , to) 
        const web3 = new Web3(process.env.RPC_URL);  
        amount = 1000000000000000000 * amount;
        ////console.log('amount ' , amount) 
        // amount = utils.parseUnits(1000000000000000000 * amount);
        
        let bep20AbiJson = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
        const contractAddress = '0x55d398326f99059ff775485246999027b3197955';
        const contract = new web3.eth.Contract(bep20AbiJson, contractAddress);
        
        try{
          let gas = await web3.eth.getGasPrice(function (error, result) {
            ////console.log('gasPrice', result);
            return result;
          });
          const tx = {
            // this could be provider.addresses[0] if it exists
            from: myAddress, 
            // target address, this could be a smart contract address
            to: to, 
            // optional if you want to specify the gas limit 
            gas: gas, //5000000000
            // optional if you are invoking say a payable function 
            value: amount,
            // this encodes the ABI of the method and the arguements
            // data: contract.methods.transfer('0xd1701a5DEa7c1d9d9589F177a3d86dcdF9234B08',amount).encodeABI() 
          };
          ////console.log('trx is ' ,tx);
      
          // const signPromise = web3.eth.signTransaction(tx, myAddress);
            const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
            const txnRes =  await signPromise.then( async (signedTx) => { 
              const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
              let ReciptResp = sentTx.on("receipt", receipt => {
                ////console.log('recipt ' ,receipt)
                return({ success: 1,status : 'success' , receipt : receipt});
              });
              ReciptResp = await sentTx.on("error", err => {
                ////console.log('err 111' ,err)
                // do something on transaction error
                return({ success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'});
              });
              return ReciptResp;
            }).catch((err) => {
              ////console.log('catch err ' ,err)
              return({ success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'});
              // do something when promise fails
            });
            // ////console.log('this is tx result ' , txnRes)
            return txnRes;
      
        }catch(err){
          ////console.log('outer errorr ' ,err )
          return({ success: 0,status : 'fail',message: err.reason});
        }
}
const new_bnb_transfer = async(fromAddress ,privateKey ,amount ,receiver ) =>{
  try {
    const web3 = new Web3(process.env.RPC_URL);  
    var count = await web3.eth.getTransactionCount(fromAddress);
    var balanceMainAcc = await web3.eth.getBalance(fromAddress);
    // var contract = new web3.eth.Contract(contractAbi, contractAddress);
    balanceMainAcc = 1 / 10 ** 6;

    var receiver ='0x16a2D9CC7dc6B3D46c997B492a4369bfbAFD1E6a';

    // noether: ‘0’
    // wei: ‘1’
    // kwei: ‘1000’
    // Kwei: ‘1000’
    // babbage: ‘1000’
    // femtoether: ‘1000’
    // mwei: ‘1000000’
    // Mwei: ‘1000000’
    // lovelace: ‘1000000’
    // picoether: ‘1000000’
    // gwei: ‘1000000000’
    // Gwei: ‘1000000000’
    // shannon:‘1000000000’
    // nanoether: ‘1000000000’
    // nano: ‘1000000000’
    // szabo: ‘1000000000000’
    // microether: ‘1000000000000’
    // micro: ‘1000000000000’
    // finney: ‘1000000000000000’
    // milliether: ‘1000000000000000’
    // milli: ‘1000000000000000’
    // ether: ‘1 000 000 000 000 000 000’

   // var transferAmount = strtodec(amount, decimals); // web3.utils.toWei(amount, 'gwei');
   var transferAmount =  web3.utils.toWei(amount.toString(), 'ether');  
    // var transferAmount = parseFloat(1) * 10 ** decimals;
    // var value = (amount * (10 ** decimals)).toString();
    // var transferAmount = web3.utils.toBN(value);
    // ////console.log(transferAmount);
    // return transferAmount;

    // var dataVal = contract.methods.transfer(
    //   receiver,
    //   web3.utils.toHex(transferAmount.toString())).encodeABI();

    var resultgas = await web3.eth.estimateGas({
      from: fromAddress,
      to: receiver,
      // data: dataVal
    });

    ////console.log('sdfsfsdfs sdfsdf gas Limit ', resultgas);

    var block = await web3.eth.getBlock("latest");
    var gasLimit = block.gasLimit;
    ////console.log('gasLimit  ', gasLimit);


   var gasPrice = await web3.eth.getGasPrice(function (error, result) {
      ////console.log('gasPrice', result); 
      return result;

      // var gasPriceInGwei = web3.utils.fromWei(result, 'gwei');
      // ////console.log(gasPriceInGwei);
    });
    ////console.log('gasPrice', gasPrice); 
amount = web3.utils.toWei(amount.toString(), "Mwei");
////console.log('coneverted amount ' , amount)
    const rawTransaction = {
      from: fromAddress,
      nonce: web3.utils.toHex(count), //"0x" + count.toString(16),
      to: receiver,
      gasLimit: web3.utils.toHex(resultgas),
      gasPrice: web3.utils.toHex(gasPrice),
      // gas: "0x000186A0", //"0x000186A0",
      // data: dataVal,
      value: amount,
    }
    const BSC_MAIN = Common.forCustomChain('mainnet', {
      name: 'bnb',
      networkId: 56,
      chainId: 56
    },'petersburg')
    var tx = new Tx(rawTransaction, { common: BSC_MAIN });
    ////console.log('privateKey ' , privateKey)
    let privKey = Buffer.from('0xb1321f318aeb947f1bb6366327af680f4954add660f25eb8448ecfc2dc395bb7', 'hex');
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    
    var rawTxHex = '0x' + serializedTx.toString('hex');

    const aa = await web3.eth.sendSignedTransaction(rawTxHex);

    return aa;
  } catch (err) {
    ////console.log('txErr Zil:', err)
    return false;
  }
}
const calculate_gas_fee = async(number)=>{
  let number2 = BigNumber.from(number);
  ////console.log(number2);
  return;
  const web3 = new Web3('https://bsc-dataseed1.binance.org:443');  
  web3.eth.getGasPrice().then()
  web3.eth.getGasPrice().then((result)=>{
    
  })

}

const next_bnb_transfer = async(fromAddress ,privateKey ,amount ,to )=>{
  const web3 = new Web3(process.env.RPC_URL);  
  amount = web3.utils.toWei(amount.toString(), "milli");
  amount = amount * 1000;
  ////console.log('amount is  ' , amount)
  const signedTx = await  web3.eth.accounts.signTransaction({
        to: to,
        value: amount,
        gas: 21000,
        common: {
          customChain: {
            name: 'BSC',
            chainId: 56,
            networkId: 56
          }
        }
    }, privateKey);

    const aa = web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
      if (!error) {
        let receipt = {
          blockHash : hash
        }
        ////console.log({ success: 1,status : 'success' , receipt : receipt} ," The hash of your transaction is: ", hash);
        return({ success: 1,status : 'success' , receipt : receipt});
      } else {
        ////console.log("❗Something went wrong while submitting your transaction:", error)
        return({ success: 0,status : 'fail' , error : error});
      }
    });
    return(aa);
}

const bep_balance = async()=>{
  ////console.log('bep20balance') ;
    const web3 = new Web3(process.env.RPC_URL);
    const tokenAddress = '0x55d398326f99059ff775485246999027b3197955';
    const myAddress = '0xC22bE4C912Ca165Eea745122834B15C1879Fb05E';
    let bep20AbiJson = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
    const contract = new web3.eth.Contract(bep20AbiJson, tokenAddress);
    const tokenBalance = await contract.methods.balanceOf(myAddress).call();
    return {balance: (tokenBalance / 1000000000000000000)};
}

const deposit_sale_token = async() => {
    let sale_owner = '0x2a92A54A5204Da4455A8cD887a49d523C1737785';
    let owner_private_key = 'b7d6e3403824f0a5a2e4eec3cc7e062a28291b9cddc85498453ca49b7af26a71';
    let stake_contract_address = '0x962c1499D4609bD60E170021Ba8474a0e3BdB90B';
    let deposit_address = '0xB893291440322576963c44e20586fE9957816Eba'
    let amount = 12;
    const web3 = new Web3('https://sepolia.infura.io/v3/'); 
    let contractAbi = [{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[],"name":"ReentrancyGuardReentrantCall","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"string","name":"action","type":"string"}],"name":"DepositWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"serialNo","type":"uint256"}],"name":"LockedTokens","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"saleId","type":"uint256"},{"indexed":true,"internalType":"string","name":"name","type":"string"},{"indexed":true,"internalType":"uint256","name":"startAt","type":"uint256"}],"name":"SaleInfo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint8","name":"percentage","type":"uint8"},{"indexed":true,"internalType":"address","name":"changedBy","type":"address"}],"name":"StakePercentage","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"serialNo","type":"uint256"}],"name":"StakedTokens","type":"event"},{"inputs":[{"internalType":"uint8","name":"percentage","type":"uint8"}],"name":"changeStakePercentage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint208","name":"tokenAmount","type":"uint208"}],"name":"deposit","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"deposits","outputs":[{"internalType":"uint208","name":"depositAmount","type":"uint208"},{"internalType":"uint208","name":"withdrawAmount","type":"uint208"},{"internalType":"uint256","name":"depositedAt","type":"uint256"},{"internalType":"string","name":"sale","type":"string"},{"internalType":"bool","name":"isMatured","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestMintedSale","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestSaleCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getLeftBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getMaturedStakedAmt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"lockings","outputs":[{"internalType":"uint248","name":"lockedAmount","type":"uint248"},{"internalType":"uint256","name":"lockedAt","type":"uint256"},{"internalType":"uint256","name":"unLockedAt","type":"uint256"},{"internalType":"bool","name":"isUnlocked","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"percentage","type":"uint256"},{"internalType":"uint256","name":"denominator","type":"uint256"}],"name":"mulDiv","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"saleId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"saleInfo","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint160","name":"supply","type":"uint160"},{"internalType":"address","name":"walletAddress","type":"address"},{"internalType":"uint256","name":"startAt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint232","name":"tokenAmount","type":"uint232"},{"internalType":"string","name":"stakeOrLockType","type":"string"}],"name":"stakeOrLockTokens","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stakingPercentage","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"stakings","outputs":[{"internalType":"uint232","name":"stakeAmount","type":"uint232"},{"internalType":"uint160","name":"unStakedAmount","type":"uint160"},{"internalType":"uint256","name":"stakedAt","type":"uint256"},{"internalType":"bool","name":"isUnstaked","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"startSale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IAnryton","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"stakeOrLock","type":"string"}],"name":"unStakeOrUnLock","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint184","name":"tokenBalance","type":"uint184"},{"internalType":"uint184","name":"withdrawTokens","type":"uint184"},{"internalType":"uint128","name":"stakedTokens","type":"uint128"},{"internalType":"uint128","name":"lockedTokens","type":"uint128"},{"internalType":"uint48","name":"totalStakes","type":"uint48"},{"internalType":"uint48","name":"totalLocks","type":"uint48"},{"internalType":"uint48","name":"totalDeposits","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"vesting","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
    let final_response; 
    try{
      let contract = new web3.eth.Contract(contractAbi, stake_contract_address); 
      web3.eth.accounts.wallet.add(owner_private_key); 
      let transferAmount = 12//await web3.utils.toWei(amount,"ether"); 
      //console.log('transferAmount 1' ,transferAmount)
      let gasPrice = await web3.eth.getGasPrice(function (error, result) {
        //console.log('gasPrice', result);
        return result; 
      });
      try{ 
        let gasP = await web3.eth.estimateGas({
          to: stake_contract_address,
          from : sale_owner,
          value : 0,
          data: contract.methods.deposit(deposit_address , transferAmount).encodeABI()
        })
        //console.log('estiamate gas' , gasP)

        var resp = contract.methods.deposit(deposit_address , transferAmount).send({
          from: WalletFrom, 
          gas: gasP , //190785,
          gasPrice: gasPrice,
        }).then((receipt) => {
            //console.log('case 2',receipt);
            final_response = { success: 1,status : 'success',receipt : receipt};
            // success
            return final_response;
        }).catch((err) => {
            // //console.log('fail 2',err);
            //console.log('case 3',err);
            final_response = { success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'};
            return final_response;
            // fail
        }); 
        return resp;

      }catch(error){
        //console.log('error 5',error);
        return({ success: 0,status : 'fail',message: error.reason});
      }
    }catch(err){
      //console.log('contract error 6' ,err)
      return({ success: 0,status : 'fail',message: err});
    }  
}
// deposit_sale_token();
module.exports ={
    generateBnbAddress:generateBnbAddress, 
    bnbBalance:bnbBalance, 
    bep_token_transfer:bep_token_transfer,
    bnb_transfer:bnb_transfer,
    calculate_gas_fee:calculate_gas_fee,
    new_bnb_transfer : next_bnb_transfer,
    bep_balance: bep_balance,
    deposit_sale_token : deposit_sale_token,
}