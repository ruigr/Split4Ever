#!/bin/sh

node_modules/mocha/bin/mocha -u tdd -R spec qa/*.js
