const axios = require('axios');
const _ = require('lodash');
const ethers = require('ethers');
const { BigNumber } = require('bignumber.js');
const EthereumjsWallet = require('ethereumjs-wallet');
const EthUtil = require('ethereumjs-util');
const Web3 = require('web3');

const Errors = require('./errors');
const Erc20ABI = require('./erc20.abi');

const web3 = new Web3();


const Erc20Service = {
    network: 'rinkeby',
    tokens: {
        krm: {
            "symbol": "krm",
            "name": "Karma",
            "decimal": 5,
            "address": "0xf006126304d8f5104dff11ce230bc2f2ad3a0e81",
            "transactionFee": 0.0005,
        },
    },
};


Erc20Service.getApiUrl = () => {
    let ApiUrl = '';

    switch (Erc20Service.network) {
        case 'homestead':
            ApiUrl = 'https://api.etherscan.io';
            break;
        case 'rinkeby':
            ApiUrl = 'https://api-rinkeby.etherscan.io';
            break;

        default:
            ApiUrl = 'https://api.etherscan.io';
    }

    return ApiUrl;
};


Erc20Service.isValidAddress = (address) => {
    return EthUtil.isValidAddress(address);
};


Erc20Service.isValidPrivateKey = (userPrivateKey) => {
    const hexReg = /^[0-9a-fA-F]+$/;
    return (
        hexReg.test(userPrivateKey) &&
        EthUtil.isValidPrivate(Buffer.from(userPrivateKey, 'hex'))
    );
};


Erc20Service.importWalletFromPrivateKey = (userPrivateKey) => {
    const wallet = new ethers.Wallet(Buffer.from(userPrivateKey, 'hex'), new ethers.providers.InfuraProvider(Erc20Service.network));

    return {
        privateKey: userPrivateKey,
        address: wallet.address,
    };
};


Erc20Service.generateKeystore = (userPrivateKey, password) => {
    const wallet = EthereumjsWallet.fromPrivateKey(Buffer.from(userPrivateKey, 'hex'));
    const keystore = wallet.toV3String(password);

    return {
        privateKey: userPrivateKey,
        keystore: keystore,
    };
};


Erc20Service.importWalletFromKeystore = (keystore, password) => {
    try {
        const wallet = EthereumjsWallet.fromV3(keystore, password);

        return {
            privateKey: wallet.getPrivateKey().toString('hex'),
            address: '0x' + wallet.getAddress().toString('hex'),
        };
    } catch (error) {
        if (_.includes(error.message, 'wrong passphrase')) {
            throw new Error(Errors.INVALID_PASSWORD);
        }
        throw new Error(Errors.INVALID_KEYSTORE);
    }
};


Erc20Service.getAddressInfo = async (coin, address) => {
    const contractAddress = Erc20Service.tokens[coin].address;
    const ApiUrl = Erc20Service.getApiUrl();

    try {
        const url = `${ApiUrl}/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=YourApiKeyToken`;
        const ethUrl = `${ApiUrl}/api?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`;
        
        const [response, ethResponse] = await Promise.all([
            axios.get(url),
            axios.get(ethUrl)
        ]);

        const balance = response.data.result;
        const ethBalance = ethResponse.data.result;

        return {
            balance: (new BigNumber(balance)).dividedBy(Math.pow(10, Erc20Service.tokens[coin].decimal)).toNumber(),
            ethBalance: (new BigNumber(ethBalance)).dividedBy(Math.pow(10, 18)).toNumber(),
        };
    } catch (error) {
        throw new Error(Errors.SERVER_ERROR);
    }
};


Erc20Service.getTransactions = async (coin, address, page = 1, perPage = 20) => {
    const ApiUrl = Erc20Service.getApiUrl();

    try {
        const contractAddress = Erc20Service.tokens[coin].address;
        const decimals = Erc20Service.tokens[coin].decimal;

        const url = `${ApiUrl}/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&sort=desc&apikey=YourApiKeyToken&page=${page}&offset=${perPage}`;
        const response = await axios.get(url);
        const transactions = response.data.result;

        return transactions;
    } catch (error) {
        throw new Error(Errors.SERVER_ERROR);
    }
};


Erc20Service.getContractABI = async (contractAddress) => {
    const ApiUrl = Erc20Service.getApiUrl();

    try {
        const url = `${ApiUrl}/api?module=contract&action=getabi&address=${contractAddress}&apikey=YourApiKeyToken`;
        const response = await axios.get(url);

        if (response.data.status === '0') {
            throw new Error(response.data.message);
        }

        return response.data.result;
    } catch (error) {
        return Erc20ABI;
    }
};


Erc20Service.getExchangeRate = async (coin) => {
    try {
        const url = `https://currencio.co/json/rate`;
        const response = await axios.post(url, `from=ETH&to=${coin.toUpperCase()}&history=24h`);

        const exchangeRate = _.last(response.data)[1];
        return exchangeRate;
    } catch (error) {
        throw error;
    }
};


Erc20Service.getFeeRate = async () => {
    try {
        const url = `https://ethgasstation.info/json/ethgasAPI.json`;
        const response = await axios.get(url);

        const freeRate = (new BigNumber(response.data.average)).dividedBy(10).dividedBy(Math.pow(10, 9)).toNumber();
        return freeRate;
    } catch (error) {
        throw error;
    }
};


Erc20Service.estimateFee = async (sendAddress, amount, minerFeeRate, coin) => {
    try {
        let estimatedGas = await Erc20Service.estimateGas(sendAddress, amount, coin);;
        estimatedGas = (new BigNumber(estimatedGas)).multipliedBy(Math.pow(10,9)).toNumber();
        const estimatedFee = (new BigNumber(estimatedGas)).multipliedBy(minerFeeRate).toNumber();

        return { estimatedFee, estimatedGas };
    } catch (error) {
        throw error;
    }
};


Erc20Service.estimateGas = async (sendAddress, amount, coin) => {
    try {
        const contractAddress = Erc20Service.tokens[coin].address;
        const contractAbiFragment = await Erc20Service.getContractABI(contractAddress);

        const MyContract = web3.eth
            .contract(typeof contractAbiFragment === 'string' ? JSON.parse(contractAbiFragment) : contractAbiFragment)
            .at(contractAddress);
        const transaction = {
            from: sendAddress,
            to: contractAddress,
            value: '0x0',
            data: MyContract.transfer.getData('0x32be343b94f860124dc4fee278fdcbd38c102d88', amount, { from: sendAddress }),
        };
        
        const provider = new ethers.providers.InfuraProvider(Erc20Service.network);

        let fee = await provider.estimateGas(transaction);
        fee = web3.fromWei(fee.toNumber(), 'gwei'); // Convert to eth unit
        fee = (new BigNumber(fee)).multipliedBy(1.1).toNumber();

        return fee;
    } catch (error) {
        throw error;
    }
};


Erc20Service.sendTransaction = async (sendAddress, receiveAddress, privateKey, amount, gasPrice = 5000000000, gasLimit = 40000, coin) => {
    try {
        privateKey = Buffer.from(privateKey, 'hex');
        
        const wallet = new ethers.Wallet(privateKey, new ethers.providers.InfuraProvider(Erc20Service.network));
        
        const contractAddress = Erc20Service.tokens[coin].address;
        const contractAbiFragment = await Erc20Service.getContractABI(contractAddress);

        const contract = new ethers.Contract(contractAddress, contractAbiFragment, new ethers.providers.InfuraProvider(Erc20Service.network));
        const contractWithSigner = contract.connect(wallet);


        const decimals = Erc20Service.tokens[coin].decimal;
        const numberOfTokens = ethers.utils.parseUnits(amount.toString(), decimals);

        const transaction = await contractWithSigner.transfer(receiveAddress, numberOfTokens, {
            gasPrice: gasPrice, gasLimit: gasLimit,
        });

        return transaction.hash;
    } catch (error) {
        throw error;
    }
};


module.exports = Erc20Service;
