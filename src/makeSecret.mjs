#!/usr/bin/env node
import Secretify from "secretify";
import {ALI_SECRET_KEYS} from "./index.mjs";
import readlineSync from "readline-sync";
import env from 'dotenv';

env.config();

const secretObj = {};
if (process.argv.length < 4) {
    for (const secretKey of ALI_SECRET_KEYS) {
        secretObj[secretKey] = readlineSync.question(secretKey + ": ");
    }
} else {
    secretObj[ALI_SECRET_KEYS[0]] = process.argv[2];
    secretObj[ALI_SECRET_KEYS[1]] = process.argv[3];
}

console.log('Secret Object:', secretObj);
console.log('Secret String:', Secretify.seal(Object.values(secretObj), process.env.CONFIGKEY))
