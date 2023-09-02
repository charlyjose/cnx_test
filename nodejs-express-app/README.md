# NodeJS Express App

This project is developed using NodeJS and Express. It also includes unit tests using Chai and Mocha.

## Installation

```shell
npm install
```

## Running the app

```shell
npm run start
```

## Test

```shell
npm run test
```

### Directory Structure

```text
.
├── test
│   ├── test.js
|-- .env
├── index.js
├── package-lock.json
├── package.json
├── README.md
```

```text
/test/test.js - Unit tests
/.env - Environment variables
/index.js - Main file
/package-lock.json - NPM lock file
/package.json - NPM package file
```

## API Documentation
> Note: A postman collection is also included in the root directory of this project for testing purposes.

### GET /time

Return the server time in Epoch format

#### Response

```json
{
  "epoch": 1588776000
}
```

### GET /metrics

Return Prometheus metrics

#### Response

```text
# HELP nodejs_app_request_duration_seconds Request duration in seconds
# TYPE nodejs_app_request_duration_seconds histogram
nodejs_app_request_duration_seconds_bucket{le="0.005"} 0 ...
```
