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

## Birden Fazla Handler

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

---

## Alt Yol Route'ları

`get(path, handler)` kullanarak aynı pager içinde farklı endpointler oluşturabilirsin.

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

## Router Tarzı Kullanım

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

`expressSpeed.listen` sunucuyu başlatır ve tüm sayfaları glob pattern'leriyle otomatik olarak yükler.

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
      console.log("istek alındı");
      next();
    },
  ],
  settings: {
    "view engine": "pug",
    views: "./pug",
  },
});
```

### Seçenekler

| Alan | Tip | Açıklama |
|------|-----|----------|
| `page.render` | `string[]` | Sayfa dosyalarını eşleştirmek için glob pattern'leri |
| `page.exclude` | `string[]` | Hariç tutulacak glob pattern'leri |
| `page.nodir` | `boolean` | Klasörleri atla |
| `use` | `function[]` | Tüm route'lara uygulanan global middleware |
| `settings` | `object` | Express app ayarları (`view engine`, `views` vb.) |

---

## GraphQL Entegrasyonu

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

## Özellikler

- Zincirleme (chainable) route API
- Express middleware uyumu
- Rol tabanlı erişim kontrolü
- Birden fazla route handler desteği
- Alt yol (sub path) routing
- `listen` üzerinden global middleware ve ayar desteği
- GraphQL entegrasyonu
- API ve sayfa route desteği