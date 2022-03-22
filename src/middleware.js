const jwt = require("jsonwebtoken");

    /*
    *Authorization: Bearer <JWT_TOKEN>
    */  
module.exports.authenticate = function(req, res, next){
    const autHeader = req.headers['authorization'];
    if(autHeader)
    {
        const token = autHeader.split(" ")[1];
        jwt.verify(token, "shhhh", (err, user)=>{
            if(err)
            {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    }else{
        res.status(401).json({message:'Oops! you have to signin first'});
    }
}
