import SecureStorage from "secure-web-storage";
var CryptoJS = require("crypto-js");
 
var SECRET_KEY = 'anyMatchMaking';



 
var Storage = new SecureStorage(localStorage, {
    hash: function hash(key) {
        key = CryptoJS.SHA256(key, SECRET_KEY);
 
        return key.toString();
    },
    encrypt: function encrypt(data) {
        data = CryptoJS.AES.encrypt(data, SECRET_KEY);
 
        data = data.toString();
 
        return data;
    },
    decrypt: function decrypt(data) {
        data = CryptoJS.AES.decrypt(data, SECRET_KEY);
 
        data = data.toString(CryptoJS.enc.Utf8);
        data = data.toString();
 
        return data;
    }
});

const secureStorage = {
    setItem: function (key, value) {
        return Promise.resolve().then(function () {
            Storage.setItem(key, value);
        });
    },
    getItem: function (key){
        return Storage.getItem(key)
    },
    removeItem: function (key) {
        return Promise.resolve().then(function () {
            Storage.removeItem(key);
        });
    },
};

export default secureStorage;