const jwt = require("jsonwebtoken");
const config = require("../config/config"); 

verifyToken = (req, res, next) => {
  //console.log("====== here verifyToken===========",req.body);
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send({ success : 0 ,message: "No token provided!" });
  }
  var decoded = jwt.decode(token); 
  if(decoded !== null)
  {
 let now = parseInt(new Date().getTime() / 1000);
    //console.log("now", now,  decoded.exp);
    if (now > decoded.exp) {
        //console.log("token expired admin");
       return res.status(401).send({ success : 0 ,message: "Token Expired!" });
    } else {
        //console.log("token not expired admin");
       req.userId = decoded.id;  
    next();
    }

    
  }
  else
  {
    return res.status(401).send({ success : 0 ,message: "Unauthorized!" });
  }
}; 

const authJwt = {
  verifyToken, 
};
module.exports = authJwt;