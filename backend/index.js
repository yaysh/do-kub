
const defaultMessage = (request, response) => {
    response.status(200).json({"message": "ok"});
}


module.exports = {
    defaultMessage,
}