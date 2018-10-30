# database-js-oracle

> Database-js driver for Oracle

`database-js-oracle` is a wrapper around the
[oracledb](https://github.com/oracle/node-oracledb) package. It is intended to
be used with the [database-js](https://github.com/mlaanderson/database-js)
package.

## Install

```bash
npm install database-js-oracle
```

## Usage

```js
const Connection = require('database-js').Connection

(async () => {
    let connection, statement, rows
    connection = new Connection('oracle://my_secret_username:my_secret_password@MY_ORA_SID')

    try {
        statement = await connection.prepareStatement("SELECT SYSDATE FROM DUAL")
        rows = await statement.query()
        console.log(rows)
    } catch (error) {
        console.log(error)
    } finally {
        await connection.close()
    }
})()
```

### Connection URI

The URI used in the `Connection` constructor has the following format:

> `oracle://[username[:password]@][connectString][?extraKey=extraValue[&extraKey=extraValue...]]`

For `connectString`, refer to the [oracledb
documentation](https://oracle.github.io/node-oracledb/doc/api.html#connectionstrings).

Refer to [database-js-common](https://github.com/mlaanderson/database-js-common)
for how `extraKey/extraValue` are handled, then refer to the [oracledb
documentation](https://oracle.github.io/node-oracledb/doc/api.html#-3311-createpool-parameters-and-attributes)
for what extra parameters and values are supported.

> TIP: If `connectString` format you need isn't handled correctly in the
`hostname` slot of the URI, try putting it in as an extraKey. 
You'll need a placeholder value in the URI.

## License

[MIT](LICENSE)
