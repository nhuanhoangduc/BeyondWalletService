const Web3 = require('web3');
const axios = require('axios');
const urljoin = require('url-join');
const _ = require('lodash');
const moment = require('moment');

const ethers = require('ethers');

const ERROR_TYPES = require('configs/errorTypes');
const coinList = require('configs/coinList');

const ApiUrl = coinList.eth.apiUrl;
const provider = coinList.eth.provider;
const providerUrl = coinList.eth.providerUrl;
const broadcastTransactionUrl = coinList.eth.broadcastTransactionUrl;

const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

const EthService = {};


EthService.generateWallet = (passphrase) => {
    const wallet = web3.eth.accounts.create(passphrase);
    const privateKey = wallet.privateKey.startsWith('0x') ? wallet.privateKey.slice(2) : wallet.privateKey;
    const address = wallet.address;

    return {
        privateKey,
        address,
    };
};


EthService.importWalletFromPrivateKey = (userPrivateKey) => {
    const wallet = new ethers.Wallet(Buffer.from(userPrivateKey, 'hex'));
    return {
        privateKey: userPrivateKey,
        address: wallet.address,
    };
};


EthService.getAddressBalance = async (address) => {
    try {
        const url = `${ApiUrl}/api?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`;
        const response = await axios.get(url);
        const balance = response.data.result;

        return web3.utils.fromWei(balance, 'ether');
    } catch (error) {
        throw new Error(ERROR_TYPES.REQUEST_FAILED);
    }
};


EthService.getTransactions = async (address) => {
    try {
        const url = `${ApiUrl}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken&page=1&offset=100`;
        const response = await axios.get(url);
        const rawTransactions = response.data.result;

        const transactions = _.reduce(rawTransactions, (memo, transaction) => {
            if (transaction.isError === '1') {
                return memo;
            }

            const transactionId = transaction.hash;
            const sendAddress = transaction.from;
            const receiveAddress = transaction.to;
            const value = Number(transaction.value) / Math.pow(10, 18);
            const transactionUrl = urljoin(broadcastTransactionUrl, 'tx', transaction.hash);
            const transactionTime = moment(Number(transaction.timeStamp) * 1000).format('MMMM D YYYY');

            memo.push({
                id: transactionId,
                sendAddress,
                receiveAddress,
                value,
                url: transactionUrl,
                time: Number(transaction.timeStamp) * 1000,
            });

            return memo;
        }, []);

        return _.uniqBy(transactions, 'id');
    } catch (error) {
        throw new Error(ERROR_TYPES.REQUEST_FAILED);
    }
};

EthService.makeTransaction = async (sendAddress, receiveAddress, privateKey, amount) => {
    try {
        const wallet = new ethers.Wallet(Buffer.from(privateKey, 'hex'));
        wallet.provider = ethers.providers.getDefaultProvider(provider);

        privateKey = Buffer.from(privateKey, 'hex');

        const nonce = await wallet.getTransactionCount();

        const transaction = {
            nonce: web3.utils.toHex(nonce),
            gasLimit: web3.utils.toHex(25000), // prevent known transaction
            gasPrice: web3.utils.toHex(10e9), // 10 Gwei
            to: receiveAddress,
            from: sendAddress,
            value: web3.utils.toHex(web3.utils.toWei(amount.toString(), 'ether')),
        };

        const transactionGas = await wallet.estimateGas(transaction);

        return {
            transaction: transaction,
            fee: transactionGas.toNumber() * 0.00000002,
        };
    } catch (error) {
        throw error;
    }
};


EthService.sendTransaction = async (transaction, privateKey) => {
    try {
        const wallet = new ethers.Wallet(Buffer.from(privateKey, 'hex'));
        wallet.provider = ethers.providers.getDefaultProvider(provider);

        await wallet.sendTransaction(transaction);
    } catch (error) {
        throw error;
    }
};


module.exports = EthService;
