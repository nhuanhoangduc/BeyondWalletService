const axios = require('axios');
const _ = require('lodash');

const BtcService = require('./btc');
const EthService = require('./eth');
const Erc20Servcie = require('./erc20');
const validate = require('utils/validate').default;
const {
    bitcoinPrivateKeyConstraint,
    ethPrivateKeyConstraint,
    bitcoinAddressConstraint,
    ethAddressConstraint,
    quantityConstraint
} = require('utils/validate');
const erc20Tokens = require('configs/eth/erc20_tokens');


const WalletService = {};

const erc20Symbols = _.keys(erc20Tokens);


WalletService.validateAmount = (coin, amount) => {
    let error = null;
    let validationResult = null;

    validationResult = validate({ amount }, { amount: quantityConstraint });
    
    if (validationResult) {
        error = validationResult[0].error;
    }

    return { error, };
};


WalletService.validateAddress = (coin, address) => {
    let error = null;
    let validationResult = null;

    switch (coin.toLowerCase()) {
        case 'btc':
            validationResult = validate({ address }, { address: bitcoinAddressConstraint });
            break;

        case 'eth':
            validationResult = validate({ address }, { address: ethAddressConstraint });
            break;

        default:
            if (_.includes(erc20Symbols, coin)) {
                validationResult = validate({ address }, { address: ethAddressConstraint });
            }
    }

    if (validationResult) {
        error = validationResult[0].error;
    }

    return { error, };
};


WalletService.validatePrivateKey = (coin, privateKey) => {
    let error = null;
    let validationResult = null;

    switch (coin.toLowerCase()) {
        case 'btc':
            validationResult = validate({ privateKey }, { privateKey: bitcoinPrivateKeyConstraint });
            break;
        case 'eth':
            validationResult = validate({ privateKey }, { privateKey: ethPrivateKeyConstraint });
            break;
        default:
            if (_.includes(erc20Symbols, coin)) {
                validationResult = validate({ privateKey }, { privateKey: ethPrivateKeyConstraint });
            }
    }

    if (validationResult) {
        error = validationResult[0].error;
    }

    return { error, };
};


WalletService.importWalletFromPrivateKey = (coin, privateKey, mnemonic, password) => {
    switch (coin.toLowerCase()) {
        case 'btc':
            return BtcService.importWalletFromPrivateKey(privateKey, mnemonic);
        case 'eth':
            return EthService.importWalletFromPrivateKey(privateKey, mnemonic, password);
        default:
            if (_.includes(erc20Symbols, coin)) {
                return Erc20Servcie.importWalletFromPrivateKey(privateKey, mnemonic, password);
            }
    }
};


WalletService.importWalletFromKeystore = (coin, keystore, password) => {
    switch (coin.toLowerCase()) {
        case 'eth':
            return EthService.importWalletFromKeystore(keystore, password);
        default:
            if (_.includes(erc20Symbols, coin)) {
                return Erc20Servcie.importWalletFromKeystore(keystore, password);
            }
    }
};


WalletService.getAddressBalance = (coin, address) => {
    switch (coin.toLowerCase()) {
        case 'btc':
            return BtcService.getAddressBalance(address);
        case 'eth':
            return EthService.getAddressBalance(address);
        default:
            if (_.includes(erc20Symbols, coin)) {
                return Erc20Servcie.getAddressBalance(coin, address);
            }
            return -1;
    }
};


WalletService.getCoinPrice = async (coin) => {
    try {
        coin = coin.toUpperCase();
        const apiUrl = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coin}&tsyms=USD,JPY`;
        const response = await axios.get(apiUrl);
        const coinInfo = response.data.RAW[coin];

        return {
            priceUSD: coinInfo.USD.PRICE,
            priceJPY: coinInfo.JPY.PRICE,
            percentChange24hUsd: coinInfo.USD.CHANGEPCT24HOUR,
            percentChange24hJpy: coinInfo.JPY.CHANGEPCT24HOUR,
        };
    } catch (error) {
        throw error;
    }
};


WalletService.sendTransaction = (coin, sendAddress, receiveAddress, privateKey, amount, fee) => {
    switch (coin.toLowerCase()) {
        case 'btc':
            return BtcService.sendTransaction(sendAddress, receiveAddress, privateKey, amount, fee);
        case 'eth':
            return EthService.sendTransaction(sendAddress, receiveAddress, privateKey, amount, fee);
        default:
            if (_.includes(erc20Symbols, coin)) {
                return Erc20Servcie.sendTransaction(sendAddress, receiveAddress, privateKey, amount, fee, coin);
            }
    }
};


WalletService.getTransactions = (coin, address, page, perPage) => {
    switch (coin.toLowerCase()) {
        case 'btc':
            return BtcService.getTransactions(address, page, perPage);
        case 'eth':
            return EthService.getTransactions(address);
        default:
            if (_.includes(erc20Symbols, coin)) {
                return Erc20Servcie.getTransactions(coin, address, page, perPage);
            }
            return [];
    }
};




module.exports = WalletService;
