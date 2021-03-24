module.exports.isLoggedIn = (req,res,next) =>{
    // console.log(currentUser);
    
    // console.log(req.session.returnTo);

    if (!req.isAuthenticated()){
        
        req.flash('error','Please Login')
        return res.redirect('/login')
    }
    next();
}  

