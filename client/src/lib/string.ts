export const nameCheck = (value: string) => {
    return /^[a-zA-Z ]+$/g.test(value);
};

export const emailCheck = (value: string) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value);
};
