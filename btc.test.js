const BtcService = require('./btc');

(async function() {
    // Validate privatekey
    try {
        console.log();
        console.log('Validate privatekey');
        const isValid = BtcService.isValidPrivateKey('     ');
        console.log('Valid:', isValid);
    } catch (error) {
        console.log(error);
    }

    // Import privatekey
    // try {
    //     console.log();
    //     console.log('Import private key');
    //     const { address, privateKey } = await BtcService.importWalletFromPrivateKey('8904d457802a89f4fbb7d09f4235732a6a702959faee78d6aedac2d8cfc16d73');
    //     console.log('Address:', address);
    //     console.log('Private key:', privateKey);
    // } catch (error) {
    //     console.log(error);
    // }

    // Import privatekey
    // try {
    //     console.log();
    //     console.log('Get address info');
    //     const addressInfo = await BtcService.getAddressInfo('mp7STSWcGzMVnNxQHv2jrJiCDdBnD36Fik');
    //     console.log('Address info:', addressInfo);
    // } catch (error) {
    //     console.log(error);
    // }

    // Get transactions
    // try {
    //     console.log();
    //     console.log('Get transactions');
    //     const transactions = await BtcService.getTransactions('mp7STSWcGzMVnNxQHv2jrJiCDdBnD36Fik');
    //     console.log('Transactions:', transactions);
    // } catch (error) {
    //     console.log(error);
    // }

    // Get utxos
    // try {
    //     console.log();
    //     console.log('Get utxos');
    //     const utxos = await BtcService.getUtxos('mp7STSWcGzMVnNxQHv2jrJiCDdBnD36Fik');
    //     console.log('Utxos:', JSON.stringify(utxos[0]));
    // } catch (error) {
    //     console.log(error);
    // }

    // Send transaction
    // try {
    //     console.log();
    //     console.log('Send transaction');
        
    //     const transactionId = await BtcService.sendTransaction(
    //         'mp7STSWcGzMVnNxQHv2jrJiCDdBnD36Fik',
    //         'mp7STSWcGzMVnNxQHv2jrJiCDdBnD36Fik',
    //         '8904d457802a89f4fbb7d09f4235732a6a702959faee78d6aedac2d8cfc16d73',
    //         0.00123
    //     );
    //     console.log(transactionId);
    // } catch (error) {
    //     console.log(error);
    // }
})();
