export type ArgsType = any[];
export type AsyncCallback<T extends ArgsType> = (...args: T) => Promise<any>;
