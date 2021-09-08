import Core from "@alicloud/pop-core";
import Secretify from "secretify";
import env from "dotenv";

env.config();

export const ALI_SECRET_KEYS = ['accessKeyId', 'accessKeySecret'];

export default class Dns01 {
    static propagationDelay
    static #client;
    static #requestOption = {method: 'POST'};

    static create(config) {
        if (!config.hasOwnProperty('secret')) return null;

        const password = process.env.SECRETIFY_KEY;
        const {accessKeyId, accessKeySecret} = Secretify.unseal(config.secret, password, ALI_SECRET_KEYS);

        this.#client = new Core({
            accessKeyId,
            accessKeySecret,
            endpoint: 'https://alidns.aliyuncs.com',
            apiVersion: '2015-01-09',
        });

        this.propagationDelay = config.propagationDelay;
        return this;
    }

    static async #getDomainByZone({dnsPrefix, dnsZone, dnsAuthorization}) {
        const result = await this.#client.request('DescribeDomainRecords', {DomainName: dnsZone}, this.#requestOption);
        const records = result['DomainRecords']['Record'] || [];
        return (records).filter(record => dnsPrefix === record.RR && dnsAuthorization === record.Value)[0];
    }

    static async init() {
        // return Promise.resolve(null);
        return null;
    }

    static async zones() {
        try {
            const result = await this.#client.request('DescribeDomains', {}, this.#requestOption);
            return (result['Domains']['Domain'] || []).map(d => d.DomainName);
        } catch (e) {
            console.log(e);
        }
    }

    static async set(data) {
        const {dnsAuthorization, dnsHost, dnsPrefix, dnsZone} = data.challenge;
        if (!dnsZone) throw new Error('No matching zone for ' + dnsHost);
        try {
            await this.#client.request(
                'AddDomainRecord',
                {DomainName: dnsZone, RR: dnsPrefix, Type: 'TXT', Value: dnsAuthorization},
                this.#requestOption
            );
            return true;
        } catch (e) {
            console.error(e);
        }
        return false;
    }

    static async get(data) {
        const {dnsAuthorization, dnsPrefix, dnsZone} = data.challenge;
        const record = await this.#getDomainByZone({dnsPrefix, dnsAuthorization, dnsZone,});
        return record ? {dnsAuthorization: record.Value} : null;
    }

    static async remove(data) {
        const {dnsAuthorization, dnsPrefix, dnsZone} = data.challenge;
        const record = await this.#getDomainByZone({dnsPrefix, dnsAuthorization, dnsZone});
        if (!record) throw new Error('Txt Record not found for removal');
        try {
            await this.#client.request('DeleteDomainRecord', {recordId: record['RecordId']}, this.#requestOption);
            return true;
        } catch (e) {
            console.error(e);
        }
        return false;
    }
}
