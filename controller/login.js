module.exports.index = (req,res)=>{
    res.render('./user/login');
}

module.exports.post = async(req,res)=>{
    
    req.flash('success','Welcome back');
    const {desiredPath='/index'} = req.session;
    delete req.session.desiredPath;
    res.redirect(desiredPath);
}