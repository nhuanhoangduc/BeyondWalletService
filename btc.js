const bitcore = require('bitcore-lib'); delete global._bitcore;
const axios = require('axios');
const urljoin = require('url-join');
const _ = require('lodash');
const { BigNumber } = require('bignumber.js');
const explorers = require('bitcore-explorers');
const Errors = require('./errors');


const satoshiValue = Math.pow(10, 8);
const { PrivateKey, Networks, Transaction, Unit } = bitcore;


const BtcService = {
    network: 'testnet',
};


BtcService.importWalletFromPrivateKey = (userPrivateKey) => {
    const privateKey = new PrivateKey(userPrivateKey);
    const address = privateKey.toAddress(Networks[network]);

    return {
        address: address.toString(),
        privateKey: privateKey.toString(),
    };
};


BtcService.getAddressInfo = (address) => new Promise((reject, resolve) => {
    const insight = new explorers.Insight(BtcService.network);

    insight.address(address, (err, rawInfo) => {
        if (err) {
            reject(err);
            return;
        }
        
        const info = {
            ...rawInfo,
            balance: (new BigNumber(rawInfo.balance)).dividedBy(satoshiValue).toNumber(),
            totalReceived: (new BigNumber(rawInfo.totalReceived)).dividedBy(satoshiValue).toNumber(),
            totalSent: (new BigNumber(rawInfo.totalSent)).dividedBy(satoshiValue).toNumber(),
            unconfirmedBalance: (new BigNumber(rawInfo.unconfirmedBalance)).dividedBy(satoshiValue).toNumber(),
        };

        resolve(info);
    });
});;

BtcService.getTransactions = async (address, page = 1, perPage = 20) => {
    let ApiUrl = '';
    if (network === 'livenet') {
        ApiUrl = 'https://insight.bitpay.com';
    } else {
        ApiUrl = 'https://test-insight.bitpay.com';
    }
    
    try {
        const from = (page - 1) * perPage;
        const to = from + perPage;
        const url = urljoin(ApiUrl, 'api', 'addrs', address, 'txs', `?from=${from}&to=${to}`);

        const response = await axios.get(url);
        const transactions = response.data.items;

        return transactions;
    } catch (error) {
        throw error;
    }
};

BtcService.getUtxos = (address) => new Promise((resolve, reject) => {
    const insight = new explorers.Insight(BtcService.network);

    insight.getUnspentUtxos([address], (error, utxos) => {
        if (error) {
            reject(error);
            return;
        }
        resolve(utxos);
    });
});


BtcService.broadcast = (transaction) => new Promise((resolve, reject) => {
    const insight = new explorers.Insight(BtcService.network);
    
    insight.broadcast(transaction, function(error, body) {
        if (error) {
            reject(error);
            return;
        }

        resolve({
            transactionId: body
        });
    });
});


BtcService.sendTransaction = async (sendAddress, receiveAddress, privateKey, amount, fee = 0.0001) => {
    const minerFee = (new BigNumber(fee)).multipliedBy(satoshiValue).toNumber();
    const transactionAmount = (new BigNumber(amount)).multipliedBy(satoshiValue).toNumber();

    // Get utxos
    let utxos = [];
    try {
        utxos = await BtcService.getUtxos(sendAddress);
    } catch (error) {
        throw new Error(Errors.SERVER_ERROR);
    }

    // Check if balance is 0
    if (utxos.length === 0) {
        throw new Error(Errors.NOT_ENOUGH_COIN);
    }

    // Get balance
    let balance = Unit.fromSatoshis(0).toSatoshis();
    for (var i = 0; i < utxos.length; i++) {
      balance += Unit.fromSatoshis(parseInt(utxos[i]['satoshis'])).toSatoshis();
    }

    // Not enough coins
    if ((balance - transactionAmount - minerFee) <= 0) {
        throw new Error(Errors.NOT_ENOUGH_COIN);
    }

    try {
        let transaction = new Transaction()
            .from(utxos)
            .to(receiveAddress, transactionAmount)
            .change(sendAddress)
            .fee(minerFee)
            .sign(privateKey);

        // broadcast the transaction to the blockchain
        const transactionId = await BtcService.broadcast(transaction.serialize());

        return transactionId;
    } catch (error) {
    throw error;
    }
};


module.exports = BtcService;
