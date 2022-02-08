const idToInteger = (params) => {
    const { id } = params;

    return parseInt(id, 10);
};

module.exports = {
    idToInteger
};