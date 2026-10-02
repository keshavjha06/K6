# K6 Performance Testing

A collection of [Grafana k6](https://k6.io) scripts for learning and practicing load and performance testing. Each script covers one k6 feature: HTTP methods, checks, thresholds, scenarios and executors, custom metrics, data parameterization, groups, and HTML reporting.

## Prerequisites

- [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) installed locally

  ```bash
  # macOS
  brew install k6

  # verify
  k6 version
  ```

- Network access. Several scripts import remote modules at runtime (papaparse, faker, k6-reporter) and call public test sites.

## Project Structure

```
K6/
├── scripts/                     # Core k6 feature examples
│   ├── get_script.js            # Basic GET request
│   ├── post_script.js           # POST login with a JSON payload
│   ├── checks.js                # Response assertions with check()
│   ├── thresholds.js            # Pass/fail criteria with abortOnFail
│   ├── k6_script.js             # Ramping stages, thresholds, HTML report, BASE_URL env var
│   ├── scenarios-executors.js   # Every executor type (uncomment the one to run)
│   ├── metrics-outputs.js       # Custom Trend, Counter, Gauge and Rate metrics
│   ├── quickpizza.js            # End-to-end user journey: home → login → pizza recommendation → rating
│   ├── faker.js                 # Random test data with Faker
│   ├── user_groups.js           # Grouped requests with an HTML report
│   └── traffic_distribution.js  # Weighted traffic split across pages (60/20/20)
├── httpMethods/
│   ├── httpBatch.js             # Parallel requests with http.batch() (array form)
│   └── httpBatchObjects.js      # Batch with request objects and named requests
└── dataParam/
    ├── csvRead/
    │   ├── csvRead.js           # Read credentials from CSV and send Basic Auth requests
    │   └── data.csv             # Username/password test data
    └── simple-data-param/
        ├── data-param.js        # Pick a random tag from a JSON file
        └── tags.json            # Tag test data
```

## Running Scripts

Run any script with `k6 run`:

```bash
k6 run scripts/checks.js
```

Override options from the command line:

```bash
k6 run --vus 10 --duration 30s scripts/get_script.js
```

Scripts that read `BASE_URL` (`k6_script.js`, `user_groups.js`, `traffic_distribution.js`, `quickpizza.js`) default to [QuickPizza](https://quickpizza.grafana.com), Grafana's public demo app for k6. Pass `-e` to point them at another target, such as a local copy started with `docker run --rm -it -p 3333:3333 ghcr.io/grafana/quickpizza-local:latest`:

```bash
k6 run -e BASE_URL=http://localhost:3333 scripts/k6_script.js
```

Scripts in `dataParam/` open their data files with relative paths, so run them from inside their folder:

```bash
cd dataParam/csvRead && k6 run csvRead.js
```

## Script Reference

| Script | Concept | Target |
| --- | --- | --- |
| `scripts/get_script.js` | Basic GET request | k6.io |
| `scripts/post_script.js` | POST with JSON body and headers | dummyjson.com |
| `scripts/checks.js` | Status, body content and size checks | reqres.in |
| `scripts/thresholds.js` | `checks`, `http_req_blocked`, `http_req_duration` thresholds with `abortOnFail` | reqres.in |
| `scripts/k6_script.js` | Ramp up/down stages, p95 and error-rate thresholds, `handleSummary` | quickpizza.grafana.com |
| `scripts/scenarios-executors.js` | `per-vu-iterations`, `shared-iterations`, `constant-vus`, `ramping-vus`, `constant-arrival-rate`, `ramping-arrival-rate`, `externally-controlled` | k6.io |
| `scripts/metrics-outputs.js` | Custom metrics (`Trend`, `Counter`, `Gauge`, `Rate`) | k6.io |
| `scripts/quickpizza.js` | Multi-step journey, token auth, JSON response parsing | quickpizza.grafana.com |
| `scripts/faker.js` | Generating random user data | — |
| `scripts/user_groups.js` | `group()` for sequential page flows | quickpizza.grafana.com |
| `scripts/traffic_distribution.js` | Probabilistic traffic split between pages | quickpizza.grafana.com |
| `httpMethods/httpBatch.js` | Parallel requests for pages, assets and APIs | quickpizza.grafana.com |
| `httpMethods/httpBatchObjects.js` | `batch`/`batchPerHost` options, named batch requests | example.com, duckduckgo.com, k6.io, grafana.com |
| `dataParam/csvRead/csvRead.js` | `SharedArray` + papaparse CSV, Basic Auth encoding | `http://localhost/login` |
| `dataParam/simple-data-param/data-param.js` | `SharedArray` with JSON data | `http://localhost` |

### Scenarios and Executors

Every scenario in `scripts/scenarios-executors.js` is commented out. Uncomment the one you want to try, then run:

```bash
k6 run scripts/scenarios-executors.js
```

### Custom Metrics

`scripts/metrics-outputs.js` has sample blocks for each metric type. Only the `Gauge` block is active; uncomment the others to see how each one aggregates in the end-of-test summary.

## HTML Reports

`k6_script.js` and `user_groups.js` use [k6-reporter](https://github.com/benc-uk/k6-reporter) in `handleSummary` to write an HTML report when the run finishes:

| Script | Output file |
| --- | --- |
| `scripts/k6_script.js` | `report.html` |
| `scripts/user_groups.js` | `HTMLReport.html` |

`traffic_distribution.js` has the same hook commented out. Reports are written to the directory you run k6 from, and `*.html` files are ignored by git.

## Resources

- [k6 documentation](https://grafana.com/docs/k6/latest/)
- [Executors](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/)
- [Thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/)
- [Metrics](https://grafana.com/docs/k6/latest/using-k6/metrics/)
