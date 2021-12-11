import { ethers, utils, Wallet, Wordlist } from "ethers";
import axios from "axios";

const ProjectID = "a7ddb64d5d1344d6aa18ddf7d09b7311";

const ProjectSecret = "ce53f65f66224412b4a14ef8ca7f39c9";

const network = ethers.providers.getNetwork("rinkeby");
const itx = new ethers.providers.InfuraProvider(network,ProjectID);

const getPrice = async () => {
    const url = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,RUB&api_key=8e3f977f6e11102efc68523559f5b103f789ff1a0bfc7490185e56c915b00d35";
    const result = await axios.get(url);
    return result.data;
}

export const getBalance = async () => {
    const balance = await itx.getBalance("0x32602797a7b27ae917610339e16e0aabee2cee24");
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

export const createNewWallet = (mnemonic) =>{
    const wallet = utils.HDNode.fromMnemonic(mnemonic);
}


