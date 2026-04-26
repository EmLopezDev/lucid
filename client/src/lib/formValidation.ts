import { objectCopy } from "./generic";

export type FormRules<T> = Record<keyof T, [(v: string) => boolean, string][]>;

export const isFormDataValid = <T extends Record<string, string>>(
    data: T,
    rules: FormRules<T>,
    emptyForm: T,
) => {
    const errors = objectCopy(emptyForm);

    for (const field in rules) {
        const failed = rules[field].find(([check]) => !check(data[field]));
        if (failed) errors[field] = failed[1] as T[typeof field];
    }

    return errors;
};

export const hasErrors = <T extends Record<string, string>>(errors: T) =>
    Object.values(errors).some(Boolean);
