import { SharedArray } from "k6/data";
import http from "k6/http";
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import encoding from 'k6/encoding';

// init
export let options = {
    vus: 5,
    duration: '5s',
    iterations: 5,
};

const csvRead = new SharedArray("credentials", function() {
    return papaparse.parse(open('./data.csv'), {header: true}).data; // returning array
});

export default function main(){

    // Pick one random row so username and password stay paired
    var randomRow = csvRead[Math.floor(Math.random() * csvRead.length)];
    var username = randomRow['username'];
    var password = randomRow['password'];

    // Generate base64 encoded credentials
    var toBeEncoded = username + ':' + password;
    var encodedString = encoding.b64encode(toBeEncoded);

    // console.log(encodedString);

    let params = {
        headers : {
        "Authorization": "Basic " + encodedString,
        "X-Requested-With": "XMLHttpRequest"
        }
    };

    let response = http.get("http://localhost/login", params);
    console.log(`Logging in using `+ username + ":" + password + ` Status: ` + response.status);
};
