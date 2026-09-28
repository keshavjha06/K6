import http from "k6/http";

export default function () {

    let requests = http.batch([
        ["GET", "https://quickpizza.grafana.com"],
        ["GET", "https://quickpizza.grafana.com/login"],
        ["GET", "https://quickpizza.grafana.com/images/pizza.png"],
        ["GET", "https://quickpizza.grafana.com/favicon.ico"],
        ["GET", "https://quickpizza.grafana.com/api/quotes"],
        ["GET", "https://quickpizza.grafana.com/api/names"],
    ]);

    console.log(requests[0].status); // First request's status code

    for (let i = 0; i < requests.length; i++) { // Iterate over all requests
        console.log(requests[i].status);
    }
}