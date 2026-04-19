export const nameCheck = (str: string) => {
    return /^[a-zA-Z ]+$/g.test(str);
};

export const emailCheck = (str: string) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str);
};

export const capitalizeString = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
