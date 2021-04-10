
const errorHandler = (response, message, status) => {
    return response.status(status).json({
        status,
        message
    })
}

export default errorHandler;
