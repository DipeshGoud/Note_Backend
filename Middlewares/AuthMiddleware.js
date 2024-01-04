const isAuth = (req, res, next) => {
    if(req.session.isAuth){
        next();
    }else{
        return res.send({
            status: 401,
            messahe: "Invalid session, Please login first",
        });
    }
}; 

module.exports = { isAuth };