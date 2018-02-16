
const tokenExtractor = (request, response, next) => {
    
    if (!request.token) {
        const authorization = request.get('authorization')
        if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
            //request.setHeader('token', authorization.substring(7))
            //request.writeHead(200, { 'token': authorization.substring(7) })
            request.token = authorization.substring(7)
            //request.setHeader("token", authorization.substring(7))
            
        }
    }
    next()
}

module.exports = { tokenExtractor }