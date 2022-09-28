export const mask = (value: any, pattern: any): string => {
    let i = 0;
    const v = value.toString();

    return pattern.replace(/#/g, () => v[i++] || '');
}