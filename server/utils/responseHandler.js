const responseHandler = (response, data, status) => {
    return response.status(status).json({
        status,
        data
    })
}

export default responseHandler;
