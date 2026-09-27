import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    thresholds: {
        checks: ['rate>0.99'],
        http_req_blocked: [{
            threshold: 'max < 500',
            abortOnFail: true,
        }],
        http_req_duration: [{
            threshold: 'p(95) < 1000',
            abortOnFail: true,
        }]
    },
};

export default function () {
    const res = http.get("https://reqres.in/api/users?page=2");

    check(res, {
        'is status 200': r => r.status === 200,
        'is not status 404': r => r.status !== 404,
        'has data': r => (JSON.parse(r.body)).data.length > 0,
        'body size is less than 2000': r => r.body.length <= 2000,
    });
    // console.log("The response body is: " , res.body);
    sleep(1);
}