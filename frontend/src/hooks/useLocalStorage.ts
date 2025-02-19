import { useState } from "react";

export const useLocalStorage = <T>(key:string, initialValue:T) => {
    const [value, setValue] = useState<T>(() => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
    });

    const setLocalStorage = (value:T) => {
        localStorage.setItem(key, JSON.stringify(value));
        setValue(value);
    };

    return [value, setLocalStorage];
};


