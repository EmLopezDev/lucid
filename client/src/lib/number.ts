export const generateRandomBigInt64 = (): bigint => {
    const array = new BigUint64Array(1);
    window.crypto.getRandomValues(array);
    return array[0];
};
