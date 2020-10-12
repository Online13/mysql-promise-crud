# mysql-promise-crud

## Why use it ?

because it's simple (**js**), asynchronous (**API Promise**) and **without writing SQL**.

## Prerequisites
You need **[node Js](https://nodejs.org/en/)** and package **[mysql](https://www.npmjs.com/package/mysql)**.

## How to use ?

```sh
npm i mysql-promise-crud
```

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

It's name of the database to use

### table

`table`  is optional, but if you don't add it to the `MySQL` instance, you must use the `set` function to initialize the table to use.


```js
db.set('table',"table name");
```

## Example

- in [server.js](./example/server.js)
- in [example.js](./example/example.js)
