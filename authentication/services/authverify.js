const jwt = require("jsonwebtoken");

function verifytoken(req, res, next) {
  const token = req.cookies?.token;
  if(req.url=='/')
  {
    if(!token)
    {
      return res.redirect("/login");
    }
  }
  if (!token) {
    next();
  } else {
    try {
      const decode = jwt.verify(token, "supersecret");
      if (!decode) {
        return res.redirect("/login");
      }
      req.user = decode;
      return res.redirect('/');
    } catch (err) {
      console.log(err);
      return res.redirect("/login");
      
    }
  }
}

module.exports = { verifytoken };
