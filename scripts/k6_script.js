import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const BASE_URL = __ENV.BASE_URL || 'https://quickpizza.grafana.com';
// k6 run -e BASE_URL=https://quickpizza.grafana.com scripts/k6_script.js

export const options = {
stages: [
    { duration: '5s', target: 3 }, // ramp up to 3 users over 5 seconds
    { duration: '10s', target: 3 }, // stay at 3 users for 10 seconds
    { duration: '5s', target: 0 }, // ramp down to 0 users over 5 seconds
  ],
  /*  vus: 3,
   duration: '5s', */
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.1'], // <10% of requests may fail,
    checks: ['rate>0.9'], // 90% of checks must pass
  },
};

export default function () {
  const response = http.get(BASE_URL);
  check(response, {
    'is status 200': (r) => r.status === 200
  });
  sleep(1);
}

export function handleSummary(data) {
  return {
    "report.html": htmlReport(data),
  };
}