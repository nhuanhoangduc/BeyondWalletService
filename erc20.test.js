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

    // Import keystore
    // try {
    //     console.log();
    //     console.log('Import keystore');
    //     const { address, privateKey, keystore } = await Erc20Service.importWalletFromKeystore(`{"address":"a0631a5beff3509a7dfdfd09cadcc836bb09b483","id":"41d2f230-321b-42d8-9d44-b75cebc91ba0","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"107bc8123ec8d82a02d78501eb9bb61d"},"ciphertext":"a08e4c74edd2c11eccb8b484a6577986c87c77140e8950a15236c8be2a1c2ee6","kdf":"scrypt","kdfparams":{"salt":"04d1db90f7c4bd5efd16bce82956cfbf29b345995aecb72a233ac43cef02645f","n":131072,"dklen":32,"p":1,"r":8},"mac":"87be497ec3f4db09695fbf7a7287390e5798297242b04dee6d4d5d124934f99f"}}`, 'nhuan');
    //     console.log('Address:', address);
    //     console.log('Private key:', privateKey);
    // } catch (error) {
    //     console.log(error);
    // }

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
    try {
        console.log();
        console.log('Send transaction');
        
        const transactionId = await Erc20Service.sendTransaction(
            '0xA0631a5beFf3509A7dFDfD09caDcC836bb09B483',
            '0xA0631a5beFf3509A7dFDfD09caDcC836bb09B483',
            'C2D2BBF1F36AAB47A6ACF67F11AEE2307E75D039A9CE6ABFB11ABBCC937E7521',
            123,
            0,
            'krm'
        );
        console.log(transactionId);
    } catch (error) {
        console.log(error);
    }
})();
