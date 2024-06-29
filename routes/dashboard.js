var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
const auth = require("../middleware/verifyToken");

router.get('/', auth, function(req,res,next) {
    if ((res.locals.role) && ((res.locals.role == 'admin') || (res.locals.role == 'super') || (res.locals.role=="voter") || (res.locals.role=="moderator") || (res.locals.role=="reporter")
    )) {
        res.render('dashboard', { title: 'Elections Dashboard',role:res.locals.role });
    }
    else {
        res.redirect('index');
    }
});
module.exports = router;