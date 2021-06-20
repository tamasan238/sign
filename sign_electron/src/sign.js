const util = require('util');
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);

console.log(document.getElementById('private').value);

async function genKey() {
    await exec('openssl ecparam -genkey -name secp521r1 -out ./key-pair.pem');
    await exec('openssl ec -in ./key-pair.pem -outform PEM -pubout -out ./public.pem');
    await exec('openssl ec -in ./key-pair.pem -outform PEM -out ./private.pem');
}

async function signFile() {
    var privkey = document.getElementById("s_private").files[0].path;
    var data = document.getElementById("s_data").files[0].path;
    await exec('openssl dgst -sha1 -sign '+privkey+" "+data+' > sign.dat');
}

async function verify() {
    var pubkey = document.getElementById("v_public").files[0].path;
    var data = document.getElementById("v_data").files[0].path;
    var sign = document.getElementById("v_sign").files[0].path;
    await exec('openssl dgst -sha1 -verify '+pubkey+" -signature "+sign+" "+data, 
    function(error, stdout, stderr){
        document.getElementById('result').innerHTML = "<h3>"+stdout+"</h3>";
    });
}