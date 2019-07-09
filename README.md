# Sequery

Automatically parse nested query string parameters into Sequelize find options.

Uses the module [qs](https://www.npmjs.com/package/qs) to parse a provided query string then returns an Sequelize compatible object with find options.

Better docs to come later.

## Some query examples:

These are parsed into objects, slightly different depending on the format option.

```js
// Order Query: '?order=id&order=-name'

// Where Query: '?where[name]=doug&where[color]=red'

// Paged Query with Filters & Order: '?where[status=2]&order=id&limit=10&offset=10'
```

## Installation

```bash
$ npm i sequery
```

or

```
yarn add sequery
```

or whatever &shrug; it's on npm you probably know how to install packages

## Usage

```js
const sequery = require('sequery');

const querystring = 'where[status]=2&where[foo]=bar&order=id&order=-baz&limit=10&offset=10';
const defaults = { limit: 10 };
const opts = { format: 'knex' };

const { where, order, offset, limit } = sequery(querystring, defaults, opts);
```

outputs:

```js
{
  where: {
    status: '2', // can't parse int for misc wheres
    foo: 'bar'
  },
  order: [
    {column: 'id', order: 'asc'},
    {column: 'baz', order: 'desc'}
  ],
  limit: 10, // limit & offset both parse the int
  offset: 10
}
```

There is also `{ format: 'sequelize' }` which just changes the `order` results to suit Sequelize like this:

```js
{ order: [['id', 'asc'], ['baz', 'desc']] }
```

