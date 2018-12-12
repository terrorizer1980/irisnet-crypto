'use strict';
const Crypto = require("../../crypto");
const Old = require('old');
const IrisKeypair = require('./iris_keypair');
const Codec = require("../../util/codec");
const Utils = require("../../util/utils");
const Constants = require('./constants').IrisNetConfig;
const Lan = require("../../constants").Language;
const Bip39 = require('bip39');

class IrisCrypto extends Crypto {
    
    /**
     *
     * @param language
     * @returns {*}
     */
    create(language) {
        let keyPair = IrisKeypair.create(switchToWordList(language));
        if (keyPair) {
            return encode({
                address: keyPair.address,
                phrase: keyPair.secret,
                privateKey: keyPair.privateKey,
                publicKey: keyPair.publicKey
            });
        }
        return keyPair;
    }

    recover(secret, language) {
        let keyPair = IrisKeypair.recover(secret,switchToWordList(language));
        if (keyPair) {
            return encode({
                address: keyPair.address,
                phrase: secret,
                privateKey: keyPair.privateKey,
                publicKey: keyPair.publicKey
            });
        }
    }

    import(privateKey) {
        let keyPair = IrisKeypair.import(privateKey);
        if (keyPair) {
            return encode({
                address: keyPair.address,
                phrase: null,
                privateKey: keyPair.privateKey,
                publicKey: keyPair.publicKey
            });
        }
    }

    isValidAddress(address) {
        return IrisKeypair.isValidAddress(address);
    }

    isValidPrivate(privateKey) {
        return IrisKeypair.isValidPrivate(privateKey);
    }

    getAddress(publicKey) {
        let pubKey = Codec.Hex.hexToBytes(publicKey);
        let address = IrisKeypair.getAddress(pubKey);
        address = Codec.Bech32.toBech32(Constants.PREFIX_BECH32_ACCADDR, address);
        return address;
    }
}

function encode(acc){
    if(!Utils.isEmpty(acc)){
        let defaultCoding = Constants.DEFAULT_ENCODING;
        switch (defaultCoding){
            case Constants.ENCODING_BECH32:{
                if (Codec.Hex.isHex(acc.address)){
                    acc.address =  Codec.Bech32.toBech32(Constants.PREFIX_BECH32_ACCADDR, acc.address);
                }
                if (Codec.Hex.isHex(acc.publicKey)){
                    acc.publicKey = Codec.Bech32.toBech32(Constants.PREFIX_BECH32_ACCPUB, acc.publicKey);
                }
            }
        }
        return acc
    }
}

function switchToWordList(language){
    switch (language) {
        case Lan.CH_S:
            return Bip39.wordlists.chinese_simplified;
        case Lan.EN:
            return Bip39.wordlists.english;
        case Lan.JP:
            return Bip39.wordlists.japanese;
        case Lan.SP:
            return Bip39.wordlists.spanish;
        default:
            return Bip39.wordlists.english;
    }
}

module.exports = Old(IrisCrypto);