declare namespace NodeJS {
    interface Global {
        localStorage: { getItem: (key: string) => any; setItem: (key: string, value: string) => any; };
    }
}
