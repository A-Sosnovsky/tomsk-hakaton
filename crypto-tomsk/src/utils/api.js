import {ethers, utils} from "ethers";
import axios from "axios";

const ProjectID = "a7ddb64d5d1344d6aa18ddf7d09b7311";
const ProjectSecret = "ce53f65f66224412b4a14ef8ca7f39c9";
const EtherscanAddress = "https://api-rinkeby.etherscan.io";
const EtherscanApiKey = "1987D7MG5P9PR7PUM47FC5G4ZWFSU9VTZ3";
const network = ethers.providers.getNetwork("rinkeby");
const itx = new ethers.providers.InfuraProvider(network, ProjectID);
window.provider = itx;
const gasPriceUAddress = "https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json?api-key=bef16ea77c24d9f80c527e71f14822a8b3b652c8dc6a4954eb1e9ffe405c";
let wallet = null;

export const getTransactions = async (from, count) => {
    if (!wallet || !wallet.address) {
        return [];
    }
    const url = `${EtherscanAddress}/api?module=account&action=txlist&address=${wallet.address}&startblock=0&endblock=999999999&page=${from}&offset=${count}&sort=desc&apikey=${EtherscanApiKey}`;
    console.log(url);
    const result = await axios.get(url);
    console.log(result.data);
    return result.data.result.map(tran => ({
        value: ethers.utils.formatEther(tran.value),
        incoming: tran.to === wallet.address,
        confirmations: tran.confirmations,
        timeStamp: tran.timeStamp,
        isError: tran.isError === "1"
    }));
};

const getGasPrice = async () => {
    const result = await axios.get(gasPriceUAddress);
    return result.data;
};

const getPrice = async () => {
    const url = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,RUB&api_key=8e3f977f6e11102efc68523559f5b103f789ff1a0bfc7490185e56c915b00d35";
    const result = await axios.get(url);
    return result.data;
}

export const getBalance = async () => {
    if (!wallet || !wallet.address) {
        return null
    }

    const balance = await itx.getBalance(wallet.address);
    const ethBalanceString = ethers.utils.formatEther(balance);
    const ethBalanceNumber = Number.parseFloat(ethBalanceString);
    const price = await getPrice();
    const usdPrice = Number.parseFloat(price.USD);
    return {ETH: ethBalanceString, USD: usdPrice * ethBalanceNumber};
}

export const getRandomMnemonic = () => {
    const result = utils.entropyToMnemonic(ethers.utils.randomBytes(16), "en");
    console.log(result);
    return result.toLowerCase().split(/ +/g);
}

export const createNewWallet = (mnemonic) => {
    wallet = utils.HDNode.fromMnemonic(mnemonic);
    console.log(wallet)
    return wallet;
}

export const loginWallet = (mnemonic) => {
    createNewWallet(mnemonic);
}

export const logoutWallet = () => {
    wallet = null;
}

export const sendTransaction = async (toAddress, amount, gasLimit, gasPrice) => {
    // eslint-disable-next-line no-debugger
    debugger;
    const wallet2 = new ethers.Wallet(wallet.privateKey)
    const walletSigner = wallet2.connect(itx);
    const dd = await itx.getGasPrice() // gasPrice;
    const tx = {
        from: wallet.address,
        to: toAddress,
        value: ethers.utils.parseEther(amount),
        nonce: itx.getTransactionCount(wallet.address, "latest"),
        gasLimit: ethers.utils.hexlify(gasLimit), // 100000
        gasPrice,
    }

    await walletSigner.sendTransaction(tx);

}