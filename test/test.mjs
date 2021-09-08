import tester from "acme-challenge-test";
import env from "dotenv";
import Dns01 from "../src/index.mjs";

env.config();

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
