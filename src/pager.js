const HTTP_METHODS = [
    "use", "param", "all",
    "get", "post", "put", "delete", "patch", "head", "options",
    "checkout", "copy", "lock", "merge", "mkactivity",
    "mkcol", "move", "notify", "propfind", "proppatch",
    "purge", "report", "search", "subscribe", "trace",
    "unlock", "unsubscribe"
];

const pager = {
    _id: 0,
    _config: {
        url: null,
        role: null,
        usings: null,
        methods: [],
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
    build() {
        const data = { ...pager._config }
        pager._config = {
            url: null,
            role: null,
            usings: [],
            settings: [],
            methods: [],
        };
        return data;
    },
};

HTTP_METHODS.forEach(method => {
    pager[method] = (...args) => {
        pager._config.methods.push({
            url: pager._config.url,
            method,
            parameters: [...args],
        });
        return pager;
    };
});

export default pager;