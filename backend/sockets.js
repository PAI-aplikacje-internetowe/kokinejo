const { checkToken } = require('./repositories/user');

authMiddleware = (socket, next) => {
    console.log("authenticating, nsp: " + socket.nsp.name);
    const authHeader = socket.handshake.headers.authorization
    if (!authHeader.startsWith("Bearer ")) {
        next(new Error("Not authorized"));
    }
    const token = authHeader.substring(7, authHeader.length);
    const user = checkToken(token);
    if (!user) {
        next(new Error("Not authorized"));
    }
    socket.data.user = user;
    next();
};

getSockets = (namespace = '') => {
    console.log("getting sockets with nsp: " + namespace);
    return sockets.of(namespace)
        .use(authMiddleware)
};

module.exports = { getSockets };
