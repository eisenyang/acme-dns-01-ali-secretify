#!/usr/bin/env node
import Secretify from "secretify";
import Dns0 from "./index.cjs";
import readlineSync from "readline-sync";
import env from 'dotenv';

env.config();

const secretObj = {};
const len = process.argv.length;
if (len < 4) {
    for (const secretKey of Dns0.ALI_SECRET_KEYS) {
        secretObj[secretKey] = readlineSync.question(secretKey + ": ");
    }
} else {
    secretObj[Dns0.ALI_SECRET_KEYS[0]] = process.argv[len - 1];
    secretObj[Dns0.ALI_SECRET_KEYS[1]] = process.argv[len];
}

console.log('Secret Object:', secretObj);
console.log('Secret String:', Secretify.seal(Object.values(secretObj), process.env.CONFIGKEY))
