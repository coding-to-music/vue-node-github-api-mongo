#!/bin/sh

ENV=prod \
LOGDNA_KEY=XXXX \
MONGO_URI=XXXX \
OCTOKIT_TOKEN=XXXX \
./node_modules/.bin/babel-node ./server/parser.js
