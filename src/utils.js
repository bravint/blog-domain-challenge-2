const idToInteger =  (params) => {
    let { id } = params;

    return parseInt(id, 10);
};

module.exports = {
    idToInteger
};