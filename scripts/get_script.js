import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    // executor: 'shared-iterations',
    executor: 'per-vu-iterations',
    vus: 200,
    iterations: 10,
    maxDuration: '30s',
    // simple script to test the k6.io website
    // vus: 5,
    // duration: '60s',

};

export default function () {
    const res = http.get('https://k6.io');
    console.log(res.status);
    sleep(1);
}