const Dns01 = require("../src/index.cjs");
const tester = require("acme-challenge-test");
require("dotenv").config();

const zone = process.env.ZONE;

const challenger = Dns01.create({secret: process.env.SECRET});

tester
    .testZone('dns-01', zone, challenger)
    .then(function () {
        console.info('PASS', zone);
    })
    .catch(function (e) {
        console.error(e.message);
        console.error(e.stack);
    });
