export const getNestedObjectPropValue = (object: any, keys: string): string => {
    const value = keys.split('.').reduce((obj, property) => {
        return obj[property]
    }, object)
    return value;
}