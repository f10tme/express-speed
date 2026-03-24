# express-speed

`express-speed`, Express uygulamalarında rota oluşturmayı daha düzenli ve zincirlenebilir hale getiren hafif bir sayfa yönetim sistemidir.

> 🇬🇧 For English documentation see [README.md](./README.md).

## Hedefler

- Rota tanımlamalarını basitleştirmek
- Sayfaları modüler hale getirmek
- Middleware ve rol tabanlı erişim kontrolünü kolaylaştırmak
- API ve sayfa rotalarını aynı yapı içinde yönetmek

---

## Kurulum

```bash
npm install express-speed
```

---

## Hızlı Başlangıç

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

### `expressSpeed.listen` Seçenekleri

| Anahtar | Tip | Açıklama |
|---------|-----|----------|
| `page.render` | `string[]` | Sayfa dosyalarını eşleştirmek için glob desenleri |
| `page.exclude` | `string[]` | Hariç tutulacak glob desenleri |
| `page.nodir` | `boolean` | Klasörleri atla |
| `use` | `function[]` | Tüm rotalara uygulanan global middleware |
| `settings` | `object` | Express uygulama ayarları (`view engine`, `views`, vb.) |

---

## Kullanım

### Temel Sayfa

```js
import { pager } from "express-speed";

let page = pager
  .url("/")
  .role("user")
  .get((req, res) => {
    res.send("Basit Sayfa");
  })
  .build();

export default page;
```

### Çoklu Handler

Aynı rota için birden fazla handler tanımlayabilirsiniz.

```js
import { pager } from "express-speed";

export default pager
  .url("/ornek")
  .get((req, res, next) => {
    console.log("ilk handler");
    next();
  })
  .get((req, res) => {
    res.send("son yanıt");
  })
  .build();
```

### Middleware

```js
import { pager } from "express-speed";

function logger(req, res, next) {
  console.log("sayfa ziyaret edildi");
  next();
}

export default pager
  .url("/profil")
  .use(logger)
  .get((req, res) => {
    res.send("Profil sayfası");
  })
  .build();
```

### Rol Tabanlı Erişim

```js
import { pager } from "express-speed";

export default pager
  .url("/admin")
  .role("admin")
  .get((req, res) => {
    res.send("Admin Paneli");
  })
  .build();
```

### Alt Yol Rotaları

Aynı pager içinde farklı uç noktalar oluşturmak için `get(yol, handler)` kullanın.

```js
import { pager } from "express-speed";

export default pager
  .url("/blog")
  .get((req, res) => {
    res.send("Blog Ana Sayfa");
  })
  .get("/blog/post/:id", (req, res) => {
    res.send(`Post ${req.params.id}`);
  })
  .get("/blog/son", (req, res) => {
    res.send("Son yazılar");
  })
  .build();
```

Oluşturulan rotalar:

```
/blog
/blog/post/:id
/blog/son
```

### Router Tarzı Kullanım

```js
import { pager } from "express-speed";

export default pager
  .url("/api")
  .get("/kullanicilar", (req, res) => {
    res.json(["kullanici1", "kullanici2"]);
  })
  .get("/urunler", (req, res) => {
    res.json(["urun1", "urun2"]);
  })
  .build();
```

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
    merhaba: String
  }
`);

const root = {
  merhaba: () => "Merhaba GraphQL",
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

- Zincirlenebilir rota API'si
- Express middleware uyumluluğu
- Rol tabanlı erişim kontrolü
- Çoklu rota handler desteği
- Alt yol yönlendirme
- `listen` üzerinden global middleware ve ayarlar
- GraphQL entegrasyonu
- API ve sayfa rota desteği