import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 1,
    duration: '1s',
};

export default function () {
    const url = 'https://dummyjson.com/auth/login';
    const payload = JSON.stringify({
        username: 'emilys',
        password: 'emilyspass',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = http.post(url, payload, params);
    check(response, {
        'is status 200': (r) => r.status === 200,
        'is response body has username': (r) => r.json().username === 'emilys',
    });
    sleep(1);
    console.log('POST Method: The Username is ' + response.json().username);
}