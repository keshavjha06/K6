import http from "k6/http";
import { check, sleep } from "k6";

export default function () {
    const res = http.get("https://reqres.in/api/users?page=2");

    check(res, {
        'is status 200': r => r.status === 200,
        'is not status 404': r => r.status !== 404,
        'has data': r => (JSON.parse(r.body)).data.length > 0,
        'body size is less than 2000': r => r.body.length <= 2000,
        'content check': r => r.body.includes('id'),
    });

    sleep(1);
}