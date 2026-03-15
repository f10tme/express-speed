# express-speed

`express-speed` is a lightweight pager system that makes route creation in Express applications more organized and chainable.

> 🇹🇷 Türkçe dokümantasyon için [TR.md](./TR.md) dosyasına göz atın.

## Goals

- Simplify route definitions
- Make pages modular
- Ease middleware and role-based access control
- Manage both API and page routes within the same structure

---

## Installation

```bash
npm install express-speed
```

---

## Basic Usage

```js
import { pager } from "express-speed";

let page = pager
  .url("/")
  .role("user")
  .get((req, res) => {
    res.send("Simple Page");
  })
  .build();

export default page;
```

---

## Multiple Handlers

You can define multiple handlers for the same route.

```js
import { pager } from "express-speed";

export default pager
  .url("/example")
  .get((req, res, next) => {
    console.log("first handler");
    next();
  })
  .get((req, res) => {
    res.send("final response");
  })
  .build();
```

---

## Sub Path Routes

Use `get(path, handler)` to create different endpoints within the same pager.

```js
import { pager } from "express-speed";

export default pager
  .url("/blog")
  .get((req, res) => {
    res.send("Blog Home");
  })
  .get("/blog/post/:id", (req, res) => {
    res.send(`Post ${req.params.id}`);
  })
  .get("/blog/latest", (req, res) => {
    res.send("Latest posts");
  })
  .build();
```

Generated routes:

```
/blog
/blog/post/:id
/blog/latest
```

---

## Middleware Usage

```js
import { pager } from "express-speed";

function logger(req, res, next) {
  console.log("page visited");
  next();
}

export default pager
  .url("/profile")
  .use(logger)
  .get((req, res) => {
    res.send("Profile page");
  })
  .build();
```

---

## Role Based Access

```js
import { pager } from "express-speed";

export default pager
  .url("/admin")
  .role("admin")
  .get((req, res) => {
    res.send("Admin Panel");
  })
  .build();
```

---

## Router Style Usage

```js
import { pager } from "express-speed";

export default pager
  .url("/api")
  .get("/users", (req, res) => {
    res.json(["user1", "user2"]);
  })
  .get("/products", (req, res) => {
    res.json(["product1", "product2"]);
  })
  .build();
```

---

## expressSpeed.listen

`expressSpeed.listen` starts the server and loads all pages automatically using glob patterns.

```js
import { expressSpeed } from "express-speed";

expressSpeed.listen(80, {
  page: {
    render: ["./page/**/*.js"],
    exclude: [],
    nodir: true,
  },
  use: [
    (req, res, next) => {
      console.log("request received");
      next();
    },
  ],
  settings: {
    "view engine": "pug",
    views: "./pug",
  },
});
```

### Options

| Key | Type | Description |
|-----|------|-------------|
| `page.render` | `string[]` | Glob patterns to match page files |
| `page.exclude` | `string[]` | Glob patterns to exclude |
| `page.nodir` | `boolean` | Skip directories |
| `use` | `function[]` | Global middleware applied to all routes |
| `settings` | `object` | Express app settings (`view engine`, `views`, etc.) |

---

## GraphQL Integration

```bash
npm install express-graphql graphql
```

```js
import { pager } from "express-speed";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => "Hello GraphQL",
};

export default pager
  .url("/graphql")
  .use(
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    }),
  )
  .build();
```

---

## Features

- Chainable route API
- Express middleware compatibility
- Role based access control
- Multiple route handlers
- Sub path routing
- Global middleware and settings via `listen`
- GraphQL integration
- API and page route support