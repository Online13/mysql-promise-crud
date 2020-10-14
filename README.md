# mysql-promise-crud

## Why use it ?

because it's simple (**js**), asynchronous (**API Promise**) and **without writing SQL**. It is especially useful for those who start and use it locally.

## Prerequisites

Before installing, download and install Node.js. Node.js 0.6 or higher is required.

Installation is done, using *npm*:

```sh
npm i mysql-promise-crud
```

## Introduction

This look like ORM. It is written in JavaScript, and use module [mysql](https://www.npmjs.com/package/mysql).

```js
const MySQL = require('mysql-promise-crud');
const config = {
	host: "localhost",
	user: "root",
	password: "****"
};
const db = new MySQL(config,"portfolio","users");
```
Module `mysql-promise-crud` return a class that need at least 2 options.

```js
require('mysql-promise-crud')(config,database,[table])
```` 

### Parameters

- config

	`config` option is an `Object` useful for connection to MySQL database. It needs host, user, password (all of them are `String` object).

- database

	It's name of the database to use

- table

	`table`  is optional, but if you don't add it to the `MySQL` instance, you must use the `set` function to initialize the table to use.


	```js
	db.set('table',"table name");
	```

### Method

- create

	```js
	db.create(data)
	```

	`data` is an array that follow order in field. 
	It's return an Promise Object, so I recommend using `async/await`.

- read

	```js
	db.read(spec=null)
	```

	You can read all row in table. Or if spec (an object like `{ field:value}`),and you get all row who follow `spec`. 	It's return an Promise Object, so I recommend using `async/await`.

- update

	```js
	db.update(up,spec=null)
	```

	Like read, but it change row or all of them (if spec is null). 
	`up` is an object that represents the new value. It's return an Promise Object, so I recommend using `async/await`.

- delete

	```js
	db.delete(spec=null)
	```

	If spec is null, so they clear table. Else, they delete all who respect `spec`. It's return an Promise Object, so I recommend using `async/await`.

## Example

| Database |  Table  |
|----------|---------|
|  example |  Person |

field : 

| name | age | birthday   |
|------|-----|------------|
| John | 18  | 18-06-1978 |
| Bob  | 29  | 28-11-1968 |


```js

const MySQL = require('mysql-promise-crud');
const config = {
	host: "localhost",
	user: "root",
	password: "****"
};
const db = new MySQL(config,"example","Person");

//MySQL.create(data)

const addPerson = async (name,age,birthday) => {
	const result = await db.create([name,age,birthday]);
	console.log(result);
	return result;
}
// MySQL.read(spec=null)

let filter = {
	name: "Test"
}

const listPerson = async (filter) => {
	const persons = await db.read(filter)
	return persons;
}

listPerson(filter)
	.then(console.log)
	.catch(console.log)

// MySQL.update(up,spec=null)

const up = {
	age: 32
}

const modify = async (up,obj=null) => {
	const test = await db.update(up);
	return test;
}
// MySQL.delete(spec=null)

const clear = async () => {
	const cls = await db.delete();
	return cls;
}

```

## others

- in [server.js](./example/server.js)
- in [example.js](./example/example.js)
