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

Creating a simple page:

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

## Multiple GET Handlers

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

This pattern works in line with Express middleware logic.

---

## Sub Path Routes

Use `get(path, handler)` to create different endpoints within the same pager. Sub paths must be written as full paths.

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

You can add middleware inside a pager.

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

Restrict page access using roles.

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

## API Endpoint Example

Pager can also be used for API endpoints.

```js
import { pager } from "express-speed";

export default pager
  .url("/api/user")
  .get((req, res) => {
    res.json({
      name: "Murat",
      role: "user",
    });
  })
  .build();
```

---

## GraphQL Integration

`express-speed` also supports GraphQL endpoints.

The following packages must be installed in your project:

```bash
npm install express-graphql graphql
```

### Basic GraphQL Example

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

### GraphQLObjectType Schema Example

`express-speed` also supports the classic GraphQL schema structure.

```js
import { pager } from "express-speed";
import { graphqlHTTP } from "express-graphql";
import { GraphQLObjectType, GraphQLString, GraphQLSchema } from "graphql";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      resolve() {
        return {
          name: "Ali",
          surname: "Yılmaz",
        };
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

export default pager
  .url("/graphql")
  .use(
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    }),
  )
  .build();
```

---

## Router Style Usage

Pager can be used like a mini router.

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

## Features

- Chainable route API
- Express middleware compatibility
- Role based access control
- Multiple route handlers
- Sub path routing
- GraphQL integration
- API and page route support

---