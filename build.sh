#!/bin/bash

rm -rf node_modules
npm install

npm run ci

rm -rf node_modules
npm install --production