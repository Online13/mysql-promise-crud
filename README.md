# mysql-promise-crud

## Why use it ?

Because it's simple and we use **Promise API**, we use Object MySQL to access database.

## Prerequisites
You need **[node Js](https://nodejs.org/en/)** and package **[mysql](https://www.npmjs.com/package/mysql)**.

## API

```js
const MySQL = require('mysql-promise-crud');
const config = {
	host: "localhost",
	user: "root",
	password: "****"
}
const db = new MySQL(config,"portfolio","users")
```

`MySQL` is a class that need at least 2 options.

```js
MySQL(config,database,[table])
```` 

### config

`config` option is an `Object` useful for connection to MySQL database. It needs host, user, password (all of them are `String` object).

### database

It's name of database to use

### table

`table` is optional but if don't add it in creation `MySQL` object, you should use function set for initialize table to use.

```js
db.set('table',"table name");
```

## Example

- in [server.js](./example/server.js)
- in [example.js](./example/example.js)
