# AirSwap Maker Kit Examples

Maker Kit includes tools and examples to help you get started on the AirSwap Network.

[![Discord](https://img.shields.io/discord/590643190281928738.svg)](https://discord.gg/ecQbV7H)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![Twitter Follow](https://img.shields.io/twitter/follow/airswap?style=social)

- Docs → https://docs.airswap.io/
- Website → https://www.airswap.io/
- Blog → https://blog.airswap.io/
- Support → https://support.airswap.io/

## Maker Examples: Node.js

- **Express** is a popular web server package. [See the Code](./express)
- **ZEIT** is a quick and easy web hosting service. [See the Code](./zeit)

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
