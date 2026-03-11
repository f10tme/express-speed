// * Sayfa yapısını oluşturan obje haline getiren zincir fonksiyonlar

const pager = {
    _id: 0,
    _config: {
        url: null,
        role: null,
        usings: null,
        methods: [],
        // method: {
        //     use: null,
        //     all: null,
        //     param: null,
        //     get: null,
        //     post: null,
        //     put: null,
        //     delete: null,
        // },
        render: null,
        renderConfig: null,
    },
    url(urlStringValue) {
        pager._config.url = urlStringValue;
        return pager;
    },
    role(roleStringAndArrayValue) {
        pager._config.role = roleStringAndArrayValue;
        return pager;
    },
    usings(usingsArrayValue) {
        pager._config.usings = usingsArrayValue;
        return pager;
    },
    use(...useVariableValue) {
        pager._config.methods.push({
            url: pager._config.url,
            method: "use",
            parameters: [...useVariableValue],
        });
        // ? delete pager.url;
        return pager;
    },
    param(...paramVariableValue) {
        pager._config.methods.push({
            url: pager._config.url,
            method: "param",
            parameters: [...paramVariableValue],
        });
        // ? delete pager.url;
        return pager;
    },
    all(...allFunctionValue) {
        pager._config.methods.push({
            url: pager._config.url,
            method: "all",
            parameters: [...allFunctionValue],
        });
        // ? delete pager.url;
        return pager;
    },
    get(...getFunctionValue) {
        pager._config.methods.push({
            url: pager._config.url,
            method: "get",
            parameters: [...getFunctionValue],
        });
        // ? delete pager.url;
        return pager;
    },
    post(...postFunctionValue) {
        pager._config.methods.push({
            url: pager._config.url,
            method: "post",
            parameters: [...postFunctionValue],
        });
        // ? delete pager.url;
        return pager;
    },
    put(...putFunctionValue) {
        pager._config.methods.push({
            url: pager._config.url,
            method: "put",
            parameters: [...putFunctionValue],
        });
        // ? delete pager.url;
        return pager;
    },
    delete(...deleteFunctionValue) {
        pager._config.methods.push({
            url: pager._config.url,
            method: "delete",
            parameters: [...deleteFunctionValue],
        });
        // ? delete pager.url;
        return pager;
    },
    // render(renderStringValue, renderObjectConfiguration = {}) {
    //     pager._config.render = renderStringValue;
    //     pager._config.renderConfig = renderObjectConfiguration;
    //     return pager;
    // },
    build() {
        const data = { ...pager._config }
        pager._config = {
            url: null,
            role: null,
            usings: [],
            settings: [],
            methods: [],
            // method: {
            //     use: null,
            //     all: null,
            //     param: null,
            //     get: null,
            //     post: null,
            //     put: null,
            //     delete: null,
            // },
            render: null,
            renderConfig: null,
        };
        return data;
    },
}

export default pager;