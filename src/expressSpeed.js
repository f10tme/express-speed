// * ExpressSpeed mvc yapısına uygun daha hızlı şekilde kullanılabilir formatta
// * Sayfalara özel Rol kontrol özelliği
// * Graphql Uyumlu

import express from "express";
import { globSync } from "glob";
import pager from "./pager.js";

let expressSpeed = {
  app: express(),
  config: {
    port: 80,
    path: {
      page: {
        render: [],
        exclude: [],
        nodir: true,
      },
    },
    use: [],
    settings: {},
  },
  trigger: {
    start: {
    },
    end: {
    }
  },
  complier: {
    pagesMap(renderPathArrayValue, pageExcludeArrayValue, nodirBooleanValue) {
      const pageFiles = renderPathArrayValue.flatMap((pathValue) =>
        globSync(pathValue, {
          nodir: nodirBooleanValue || true,
          ignore: pageExcludeArrayValue,
        })
          .map((e) => "file:///" + process.cwd().replaceAll("\\", "/") + "/" + e.replaceAll("\\", "/"))
      );
      return pageFiles;
    },
    async pagesImport(pagePathArrayValue) {
      const pages = await Promise.all(pagePathArrayValue.map(async (pathValue) => {
        if (pathValue) {
          let page = (await import(pathValue)).default;
          if (page) {
            page._path = pathValue;
            return page;
          } else console.log("@ERROR", pathValue);
        }
      }));
      return pages;
    },
    pageRender(pageObjectValue) {
      if (!pageObjectValue) {
        return false;
      }
      const app = expressSpeed.app;
      for (const router of pageObjectValue.methods) {
        let parameters = ("string" == typeof router.parameters[0]) ? [...router.parameters] : [router.url, ...router.parameters];
        switch (router.method.toString().toLowerCase()) {
          case "use":
            app.use(...parameters);
            break;
          case "all":
            app.all(...parameters);
            break;
          case "param":
            app.param(...parameters);
            break;
          case "get":
            app.get(...parameters);
            break;
          case "post":
            app.post(...parameters);
            break;
          case "put":
            app.put(...parameters);
            break;
          case "delete":
            app.delete(...parameters);
            break;

          default:
            break;
        }
      }
    },
    async load() {
      for (const useValue of expressSpeed.config.use) expressSpeed.app.use(useValue);
      for (let [setKey, setValue] of Object.entries(expressSpeed.config.settings)) expressSpeed.app.set(setKey, setValue);
      let pagesMap = expressSpeed.complier.pagesMap(expressSpeed.config.path.page.render, expressSpeed.config.path.page.exclude);
      let pages = await expressSpeed.complier.pagesImport(pagesMap);
      for (let page of pages) expressSpeed.complier.pageRender(page);
    }
  },
  async listen(port = 80, config = {
    port: null,
    page: {},
    use: [],
    usings: [],
    settings: {},
    go: null,
  }) {
    if (typeof config.go == "function") config.go(expressSpeed);
    config.port = port;
    if (typeof config == "object") {
    }
      expressSpeed.config.path.page = {
        ...expressSpeed.config.path.page,
        ...config.page
      } || {};
      expressSpeed.config.port = config.port || 80;
      expressSpeed.config.use = config.use || [];
      expressSpeed.config.settings = config.settings || {};

    expressSpeed.complier.load();
    expressSpeed.app.listen(expressSpeed.config.port);
  },
}

expressSpeed.pager = pager;

export default expressSpeed;