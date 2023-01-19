# random-xkcd

A Mastodon bot that uses Cloudflare workers and scheduled events to send a random xkcd comic

... code behind https://wires.gg/@cat

## Installation

To start, clone this repository and after:

```sh
# Install NPM packages
$ npm install
# Move the example wrangler file
$ mv wrangler.example.toml wrangler.toml
# Add your Mastodon access token to worker
$ npm run access_token
# Add the instance URL to the worker
$ npm run instance_url
# Deploy worker
$ npm run deploy
```

## Usage

Check your Mastodon account and it will post a random xkcd article at the given cron intervals
