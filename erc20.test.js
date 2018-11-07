const Erc20Service = require('./erc20');
const { BigNumber } = require('bignumber.js');

// Erc20Service.network = 'homestead';

(async function() {
    // Validate address
    // try {
    //     console.log();
    //     console.log('Validate address');
    //     const isValid = Erc20Service.isValidAddress('0xA0631a5beFf3509A7dFDfD09caDcC836bb09B483');
    //     console.log('Valid:', isValid);
    // } catch (error) {
    //     console.log(error);
    // }

    // Validate privatekey
    // try {
    //     console.log();
    //     console.log('Validate privatekey');
    //     const isValid = Erc20Service.isValidPrivateKey('3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266');
    //     console.log('Valid:', isValid);
    // } catch (error) {
    //     console.log(error);
    // }

    // Import private key
    // try {
    //     console.log();
    //     console.log('Import private key');
    //     const { address, privateKey } = await Erc20Service.importWalletFromPrivateKey('C2D2BBF1F36AAB47A6ACF67F11AEE2307E75D039A9CE6ABFB11ABBCC937E7521', 'nhuan');
    //     console.log('Address:', address);
    //     console.log('Private key:', privateKey);
    // } catch (error) {
    //     console.log(error);
    // }

    // Generate keystore
    // try {
    //     console.log();
    //     console.log('Generate keystore');
    //     const { address, privateKey, keystore } = await Erc20Service.generateKeystore('C2D2BBF1F36AAB47A6ACF67F11AEE2307E75D039A9CE6ABFB11ABBCC937E7521', '123123123');
    //     console.log('Address:', address);
    //     console.log('Private key:', privateKey);
    //     console.log('keystore:', keystore);
    // } catch (error) {
    //     console.log(error);
    // }

    // Import keystore
    // try {
    //     console.log();
    //     console.log('Import keystore');
    //     const { address, privateKey, keystore } = await Erc20Service.importWalletFromKeystore(`{"version":3,"id":"950bc641-0c49-4f61-bc14-f20b657df0bc","address":"a0631a5beff3509a7dfdfd09cadcc836bb09b483","crypto":{"ciphertext":"84fc9dcd9c193fac67712ece0436207df8baa755b3daf54913dc1133840462ed","cipherparams":{"iv":"8ec14259b256f2abd6d796ba1152a5bf"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"622d898840bfd40c27e611cab2b32c4492122f771ba80ec8b635df45853fbfc7","n":262144,"r":8,"p":1},"mac":"62fa7705498e69268424d765c0ae47849a1caebd553084a2aa1f91a3deb3eee4"}}`, 'nhuan');
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
    // try {
    //     console.log();
    //     console.log('Send transaction');
        
    //     const transactionId = await Erc20Service.sendTransaction(
    //         '0xA0631a5beFf3509A7dFDfD09caDcC836bb09B483',
    //         '0xA0631a5beFf3509A7dFDfD09caDcC836bb09B483',
    //         'C2D2BBF1F36AAB47A6ACF67F11AEE2307E75D039A9CE6ABFB11ABBCC937E7521',
    //         123,
    //         null,
    //         null,
    //         'krm'
    //     );
    //     console.log(transactionId);
    // } catch (error) {
    //     console.log(error);
    // }

    // Get fee
    try {
        console.log();
        console.log('Get fee');
        const exchangeRate = await Erc20Service.getExchangeRate('krm');
        const feerate = await Erc20Service.getFeeRate();
        const { estimatedFee, estimatedGas } = await Erc20Service.estimateFee('0xA0631a5beFf3509A7dFDfD09caDcC836bb09B483', 1000000, feerate, 'krm');
        console.log(estimatedFee)
        console.log(exchangeRate)
        console.log('fee:', estimatedFee * exchangeRate);
        console.log(estimatedGas);
    } catch (error) {
        console.log(error);
    }

    // Get exchange rate
    // try {
    //     console.log();
    //     console.log('Get exchange rate');
    //     const rate = await Erc20Service.getExchangeRate('krm');
    //     console.log('rate:', rate);
    // } catch (error) {
    //     console.log(error);
    // }

    // Get fee rate
    // try {
    //     console.log();
    //     console.log('Get fee rate');
    //     const feerate = await Erc20Service.getFeeRate();
    //     console.log('feerate:', feerate);
    // } catch (error) {
    //     console.log(error);
    // }
})();
