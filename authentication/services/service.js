const jwt = require("jsonwebtoken");
const expsession = require('express-session')


function validtoken() {
  return async (req, res, next) => {
    const token = req.cookies?.sid;

    if (!token) {
      return res.redirect("/login");
    }
    try {
      const decoded = jwt.verify(token, "supersecret");
      if (decoded === null) {
        return res.redirect("/login");
      }
      req.user = decoded;
      next()
    } catch (error) {
      console.log(error);
      res.redirect('/login')
    }
  };
}

function isauthenticated() {
  return async (req, res, next) => {
    const token = req.cookies?.sid;
    if (!token) {
      next()
    }

    try {
        const decoded = jwt.verify(token, "supersecret");
        console.log(decoded)
        if (decoded === null) {
          next()
        }
        req.user = decoded;
        return res.redirect('back')
      } catch (error) {
        next()
      }

  };
}



module.exports = { validtoken,isauthenticated};
