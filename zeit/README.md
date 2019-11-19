# Maker Kit: ZEIT Now Serverless Example

**:warning: Maker Kit is in beta for use on Rinkeby only.**

## Setup

Requires [Node.js](https://nodejs.org) `v8.10.0` or above and NPM or [Yarn](https://yarnpkg.com/lang/en/docs/install/).

#### 1. Install Zeit CLI

```
npm i -g now
```

or

```
yarn global add now
```

#### 2. Login to Zeit CLI

```
now login
```

#### 3. Clone this repo and install dependencies

```
git clone https://github.com/airswap/airswap-maker-kit-examples
cd airswap-maker-kit-examples/zeit
yarn install
```

#### 4. Create a `.env` file in the root of this directory, modeled after `.env.example`

Environment variables are loaded from a `.env` file in the root directory. The following must be set:

- `ETHEREUM_ACCOUNT` - The private key of an account to use for staking and trading.
- `ETHEREUM_NODE` - The URL of an Ethereum node to connect to.

There is an example `.env.example` that you can copy to `.env` to start with.

### Ethereum Account

To use an existing Ethereum account, set the `ETHEREUM_ACCOUNT` in your `.env` file. Otherwise it's easy to create an account using MetaMask or the `yarn utils:account` script in the [Maker Kit](https://github.com/airswap/airswap-maker-kit) repository. Paste the generated private key into your `.env` file.

### Ethereum Node

To use an existing Ethereum node, set the `ETHEREUM_NODE` in your `.env` file. Otherwise you can create a free account with INFURA. Navigate to https://infura.io/ to create an account and generate an API key and URL.

### Contract Versions

The Swap and Indexer contracts used by Maker Kit are specified within their respective packages, `@airswap/swap` and `@airswap/indexer` in the [AirSwap Protocols](https://github.com/airswap/airswap-protocols) repository.

## Commands

| Command   | Description                    |
| :-------- | :----------------------------- |
| `yarn`    | Install dependencies           |
| `now dev` | Run the maker locally          |
| `now`     | Deploy your maker to the cloud |

## Quick Start

The reference Node.js maker is configured to quote `WETH/DAI` at price `0.1` on port `8080`.

### Testing your ZEIT maker Locally

1. From the root of this directory, run `now dev`
2. In another command line window, navigate to [Maker Kit](https://github.com/airswap/airswap-maker-kit)
3. Make sure that you've also created an appropriate `.env` in `maker-kit`
4. Run `yarn peers:get`, press enter through all prompts except "locator". When asked for locator, specify `http://localhost:3000`
5. Observe that your Zeit Serverless function successfully serves a quote successfully!

### Deploying your ZEIT Maker to the cloud

1. From the root of this directory, run `now`
2. That's all there is to it!
