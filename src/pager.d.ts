type MethodHandler = (...args: any[]) => typeof pager;

declare const pager: {
    _id: number;
    _config: {
        url: string | null;
        role: string | string[] | null;
        usings: any[] | null;
        methods: Array<{ url: string, method: string, parameters: any[] }>;
    };
    url(value: string): typeof pager;
    role(value: string | string[]): typeof pager;
    usings(value: any[]): typeof pager;
    build(): object;

    // Standart
    use: MethodHandler;
    param: MethodHandler;
    all: MethodHandler;
    get: MethodHandler;
    post: MethodHandler;
    put: MethodHandler;
    delete: MethodHandler;
    patch: MethodHandler;
    head: MethodHandler;
    options: MethodHandler;
    // WebDAV
    checkout: MethodHandler;
    copy: MethodHandler;
    lock: MethodHandler;
    merge: MethodHandler;
    mkactivity: MethodHandler;
    mkcol: MethodHandler;
    move: MethodHandler;
    notify: MethodHandler;
    propfind: MethodHandler;
    proppatch: MethodHandler;
    purge: MethodHandler;
    report: MethodHandler;
    search: MethodHandler;
    subscribe: MethodHandler;
    trace: MethodHandler;
    unlock: MethodHandler;
    unsubscribe: MethodHandler;
};

export default pager;