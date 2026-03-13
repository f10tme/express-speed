# express-speed

`express-speed`, Express uygulamalarında route oluşturmayı daha düzenli ve zincirleme (chainable) hale getiren basit bir pager sistemidir.

> 🇬🇧 For English documentation, see [README.md](./README.md).

## Amaç

- Route tanımlamayı sadeleştirmek
- Sayfaları modüler hale getirmek
- Middleware ve rol kontrolünü kolaylaştırmak
- API ve sayfa route'larını aynı yapı içinde yönetmek

---

## Kurulum

```bash
npm install express-speed
```

---

## Temel Kullanım

Basit bir sayfa oluşturma:

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

## Birden Fazla GET Handler

Aynı route içinde birden fazla handler tanımlayabilirsin.

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

Bu yapı Express middleware mantığıyla çalışır.

---

## Alt Yol Route'ları

`get(path, handler)` kullanarak aynı pager içinde farklı endpointler oluşturabilirsin. Alt yollar tam path olarak yazılmalıdır.

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

Oluşan route'lar:

```
/blog
/blog/post/:id
/blog/latest
```

---

## Middleware Kullanımı

Pager içine middleware ekleyebilirsin.

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

## Rol Tabanlı Erişim

Role kullanarak sayfaya erişimi sınırlandırabilirsin.

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

## API Endpoint Örneği

Pager, API endpointleri için de kullanılabilir.

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

## GraphQL Entegrasyonu

`express-speed`, GraphQL endpointlerini de destekler.

Bunun için projende şu paketler kurulu olmalıdır:

```bash
npm install express-graphql graphql
```

### Temel GraphQL Örneği

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

### GraphQLObjectType Schema Örneği

`express-speed` ayrıca klasik GraphQL schema yapısını da destekler.

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

## Router Tarzı Kullanım

Pager küçük bir router gibi kullanılabilir.

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

## Özellikler

- Zincirleme (chainable) route API
- Express middleware uyumu
- Rol tabanlı erişim kontrolü
- Birden fazla route handler desteği
- Alt yol (sub path) routing
- GraphQL entegrasyonu
- API ve sayfa route desteği

---