## AirSwap Maker Kit + ZEIT Now Serverless

#### Initial Zeit Setup

1. Install Zeit CLI `npm i -g now` or `yarn global add now`
2. Login to Zeit Now `now login`
3. Clone this repo, `cd` in.
4. Create a `.env` file in the root of this directory, modeled after `.env.example`

#### Testing your Zeit maker Locally

1. From the root of this directory, run `now dev`
2. In another command line window, navigate to `maker-kit` (which you can clone down here: http://github.com/airswap/maker-kit)
3. Make sure that you've also created an appropriate `.env` in `maker-kit`
4. Run `yarn peers:get`, press enter through all prompts except "locator". When asked for locator specify `http://localhost:3000`
5. Observe that your Zeit Serverless function successfully serves a quote!

#### Deploying your Zeit Maker to the cloud

1. From the root of this directory, run `now`
2. That's it.

#### Development TODOs

1. Setup Zeit secret management for `ETHEREUM_PRIVATE_KEY`
2. Write more narrow TypeScript types once the code is closer to being frozen
