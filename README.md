# acme-dns-01-ali-secretify

AliDNS challenger for ACME.js and Greenlock.js, **keeping accessKeyId/Secret security.**

## Why
Greenlock.js save challenger config in plain json by default.

This for keeping the AliDNS's accessKeyId/Secret encrypt with AES. 

## Install

```bash
npm install --save acme-dns-01-ali-secretify
```

Generate AliCloud secretString:

1. [Get accessKeyId && accessKeySecret](https://help.aliyun.com/knowledge_detail/38738.html)
2. Set "SECRETIFY_KEY=VeryStrongPassword" in your env.
3. Run `npx makeSecret` then copy the `secretString` for future use.

## Usage
You can use it with any compatible ACME library,
such as Greenlock.js or ACME.js.

### Greenlock.js

```js
var Greenlock = require('greenlock');

var greenlock = Greenlock.create();
greenlock.manager.defaults({
  subscriberEmail: email,
  agreeToTerms: false,
  challenges: {
    'dns-01': {
      module: 'acme-dns-01-ali-secretify',
      secret: 'yout secretString'
    },
  },
});
```

See [Greenlock.js](https://git.rootprojects.org/root/greenlock.js) documentation for more details.

See the [ACME.js](https://git.rootprojects.org/root/acme-v2.js) for more details.

### Build your own

There are only 5 methods:

- `init(config)`
- `zones(opts)`
- `set(opts)`
- `get(opts)`
- `remove(opts)`

```js
dns01
  .set({
    identifier: { value: 'foo.example.co.uk' },
    wildcard: false,
    dnsZone: 'example.co.uk',
    dnsPrefix: '_acme-challenge.foo',
    dnsAuthorization: 'xxx_secret_xxx'
  })
  .then(function() {
    console.log('TXT record set');
  })
  .catch(function() {
    console.log('Failed to set TXT record');
  });
```

See [acme-dns-01-test](https://git.rootprojects.org/root/acme-dns-01-test.js)
for more implementation details.

## Tests
Create `.env` file in project root directory:

```dotnetcli
ZONE='xxx'
SECRET='xxx'
SECRETIFY_KEY='VeryStrongPassword'
```

```bash
node test/test.mjs
```
