# AirSwap: ZEIT Now Serverless Example

Maker Kit includes tools and examples to help you get started on the AirSwap Network.

[![Discord](https://img.shields.io/discord/590643190281928738.svg)](https://discord.gg/ecQbV7H)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![Twitter Follow](https://img.shields.io/twitter/follow/airswap?style=social)

- Docs → https://docs.airswap.io/
- Website → https://www.airswap.io/
- Blog → https://blog.airswap.io/
- Support → https://support.airswap.io/

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
git clone https://github.com/airswap/airswap-maker-example-zeit
cd airswap-maker-example-zeit
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

## Commands

| Command   | Description                    |
| :-------- | :----------------------------- |
| `yarn`    | Install dependencies           |
| `now dev` | Run the maker locally          |
| `now`     | Deploy your maker to the cloud |

## Quick Start

The reference Node.js maker is configured to quote `WETH/DAI` at price `0.1` on port `3000`.

### Testing your ZEIT maker Locally

1. From the root of this directory, run `now dev`
2. In another command line window, navigate to [Maker Kit](https://github.com/airswap/airswap-maker-kit)
3. Make sure that you've also created an appropriate `.env` in `maker-kit`
4. Run `yarn peers:get`, press enter through all prompts except "locator". When asked for locator, specify `http://localhost:3000`
5. Observe that your Zeit Serverless function successfully serves a quote successfully!

### Deploying your ZEIT Maker to the cloud

1. From the root of this directory, run `now`
2. That's all there is to it!


## Notes

- **CORS** - Makers must run their servers with CORS enabled to accept connections from in-browser web applications including AirSwap Instant.
- **Token Values** - All token values are in the smallest indivisible units of a token (wei).
- **Nonce Window** - Each order is identified by a unique nonce. The "nonce window" is the time within which every order returned will include the same nonce. This can be configured to prevent overexposure.
- **Trading ETH** - Swap only supports tokens, not native ether (ETH). To trade ETH it must be wrapped (WETH).

## Helpful for Testing on Rinkeby

- **ETH** to pay for transactions - [Faucet](https://faucet.rinkeby.io/)
- **WETH** for trading - `0xc778417e063141139fce010982780140aa0cd5ab` [Etherscan](https://rinkeby.etherscan.io/address/0xc778417e063141139fce010982780140aa0cd5ab)
- **DAI** for trading - `0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea` [Etherscan](https://rinkeby.etherscan.io/address/0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea)
- **AST** for staking - `0xcc1cbd4f67cceb7c001bd4adf98451237a193ff8` [Etherscan](https://rinkeby.etherscan.io/address/0xcc1cbd4f67cceb7c001bd4adf98451237a193ff8) / [Faucet](https://ast-faucet-ui.development.airswap.io/)
