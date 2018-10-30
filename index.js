const oracledb = require('oracledb')

/**
 * database-js driver for Oracle
 *
 * @author  Andrew Barnett
 *
 * @see     https://github.com/mlaanderson/database-js
 * @see     https://github.com/oracle/node-oracledb
 */
class Oracle {

    constructor( connection ) {
        this.connection = connection
        this.pool = null
        this.cnxn = null

        this._inTransaction = false
        oracledb.autoCommit = true

        oracledb.outFormat = oracledb.OBJECT
    }

    /**
     * Creates a database connection on demand.
     *
     * @returns Promise< Connection >
     */
    async _connect() {
        if ( !this.pool ) {
            const options = {
                user: this.connection.Username,
                password: this.connection.Password,
                connectString: this.connection.Hostname
            }

            if ( this.connection.Parameters ) {
                const extraParams = require('database-js-common').parseConnectionParams(this.connection.Parameters, true);
                Object.assign( options, extraParams )
            }

            this.pool = await oracledb.createPool( options )
        }

        if ( !this.cnxn ) {
            this.cnxn = await this.pool.getConnection()
        }

        return this.cnxn
    }

    /**
     * Performs a query or data manipulation command
     *
     * @param {string} sql
     * @returns Promise< Array< Object > >
     */
    async query(sql) {
        let connection = await this._connect()
        let result = await connection.execute(sql)
        return result.rows
    }

    /**
     * Performs a data manipulation command
     *
     * @param {string} sql
     * @returns Promise< Array< Object > >
     */
    async execute(sql) {
        return await query(sql)
    }

    /**
     * Closes a database connection
     *
     * @returns Promise<>
     */
    async close() {
        if ( this.cnxn ) {
            await this.rollback()
            await this.cnxn.close()
            this.cnxn = null
        }
        if ( this.pool ) {
            await this.pool.close(0)
            this.pool = null
        }
    }

    isTransactionSupported() {
        return true
    }

    inTransaction() {
        return this._inTransaction
    }

    beginTransaction() {
        this._inTransaction = true
        oracledb.autoCommit = false
    }

    async commit() {
        if(this._inTransaction) {
            await this.connection.commit()
            this._inTransaction = false
            oracledb.autoCommit = true
        }
    }

    async rollback() {
        if(this._inTransaction) {
            await this.connection.rollback()
            this._inTransaction = false
            oracledb.autoCommit = true
        }
    }

}

module.exports = {

    open: (connection) => {
        return new Oracle( connection )
    }

}
