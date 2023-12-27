const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {
      // res.send("Error Occured", error);
      res.status(401).send("Authentication Error: " + error.message);
    }
    console.log("My requested user", req.user)
    return next();
  };
}

function checkForUserRole(role) {
  return (req, res, next)=> {
 
        // Check if the user is authenticated
       if (!req.user) {
         return res.status(401).json({ message: "Unauthorized" });
        }
   
          // Check if the user's role matches the required role
        if (req.user.role === role) {
          // User has the required role, grant access
          return next();
        } else {
          // User does not have the required role, deny access
          return res.status(403).json({ message: "Access forbidden" });
        }
  }
}

module.exports = {
  checkForAuthenticationCookie,
  checkForUserRole
};
