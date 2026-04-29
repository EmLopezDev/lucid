export const generateRandomBigInt64 = () => {
    const array = new BigUint64Array(1);
    window.crypto.getRandomValues(array);
    return array[0].toString();
};
