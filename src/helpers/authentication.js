const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {

    const token = req.cookies.Authorization;
    // const token = authCookie && authCookie.split(' ')[1]
    // not doing the above one, because using the Signed token in the cookie
    if (token == null) return res.render('index')

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })

}

module.exports = authentication;