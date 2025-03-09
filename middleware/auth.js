const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware function that has access to the request and response objects and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named next. 
// Middleware functions can perform the following tasks:
// Execute any code.
// Make changes to the request and the response objects.
// End the request-response cycle.
// Call the next middleware function in the stack.
// If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging
// Middleware functions can be mounted at a path. If the path is not specified, it defaults to “/”, which means that the middleware function will be executed for every request to the app.
// The order of middleware loading is important: middleware functions that are loaded first are also executed first.
module.exports = function(req, res, next) { // Middleware function
    // Get token from header
    const token = req.header('x-auth-token'); // -> `x-auth-token` is the key for the token in the header

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); // Verify the token with the secret key 

        req.user = decoded.user; // Set the user to the decoded user from the token  
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}