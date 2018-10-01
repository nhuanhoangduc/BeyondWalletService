const Erc20Service = require('./erc20');

(async function() {
    // Import privatekey
    // try {
    //     console.log();
    //     console.log('Import private key');
    //     const { address, privateKey } = await Erc20Service.importWalletFromPrivateKey('C2D2BBF1F36AAB47A6ACF67F11AEE2307E75D039A9CE6ABFB11ABBCC937E7521', 'nhuan');
    //     console.log('Address:', address);
    //     console.log('Private key:', privateKey);
    // } catch (error) {
    //     console.log(error);
    // }

    // Import privatekey
    // try {
    //     console.log();
    //     console.log('Import private key');
    //     const { address, privateKey, keystore } = await Erc20Service.generateKeystore('C2D2BBF1F36AAB47A6ACF67F11AEE2307E75D039A9CE6ABFB11ABBCC937E7521', 'nhuan');
    //     console.log('Address:', address);
    //     console.log('Private key:', privateKey);
    //     console.log('keystore:', keystore);
    // } catch (error) {
    //     console.log(error);
    // }

    // Import keystore
    try {
        console.log();
        console.log('Import keystore');
        const { address, privateKey, keystore } = await Erc20Service.importWalletFromKeystore(`{"version":3,"id":"2fc42db8-67b2-4b58-afd1-70aed5edb51e","address":"bd3d1f62e92b27adb194505f3ba96cd318b364d7","crypto":{"ciphertext":"b272fd7fd1344e2f3551e9ec592ba9a4376d657edcec9867d300ec500899028c","cipherparams":{"iv":"4c972981a8993da91ff8416210d457f8"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"0e03df8c937637e3f299ad0366249e4ff9375b73da10185b24cdee798401d532","n":8192,"r":8,"p":1},"mac":"dbcda23fd9c0f27b532d88f2166433a81aeab2b708670ee99960c55c062ea6be"}}`, 'nhuan');
        console.log('Address:', address);
        console.log('Private key:', privateKey);
    } catch (error) {
        console.log(error);
    }

    // Get address info
    // try {
    //     console.log();
    //     console.log('Get address info');
    //     const addressInfo = await Erc20Service.getAddressInfo('krm', '0xA0631a5beFf3509A7dFDfD09caDcC836bb09B483');
    //     console.log('Address info:', addressInfo);
    // } catch (error) {
    //     console.log(error);
    // }

    // Get transactions
    // try {
    //     console.log();
    //     console.log('Get transactions');
    //     const transactions = await Erc20Service.getTransactions('krm', '0xA0631a5beFf3509A7dFDfD09caDcC836bb09B483');
    //     console.log('Transactions:', transactions);
    // } catch (error) {
    //     console.log(error);
    // }

    // Get contract abi
    // try {
    //     console.log();
    //     console.log('Get contract abi');
    //     const abi = await Erc20Service.getContractABI('0xf006126304d8f5104dff11ce230bc2f2ad3a0e81');
    //     console.log('Abi:', abi);
    // } catch (error) {
    //     console.log(error);
    // }

    // Send transaction
    // try {
    //     console.log();
    //     console.log('Send transaction');
        
    //     const transactionId = await Erc20Service.sendTransaction(
    //         '0xA0631a5beFf3509A7dFDfD09caDcC836bb09B483',
    //         '0xA0631a5beFf3509A7dFDfD09caDcC836bb09B483',
    //         'C2D2BBF1F36AAB47A6ACF67F11AEE2307E75D039A9CE6ABFB11ABBCC937E7521',
    //         123,
    //         0,
    //         'krm'
    //     );
    //     console.log(transactionId);
    // } catch (error) {
    //     console.log(error);
    // }
})();
