const generateString = key => {
    let str = Math.random().toString(36).substring(7);
    return str.repeat(key.length);
}

export default generateString;
