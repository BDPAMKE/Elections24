var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
const auth = require("../middleware/verifyToken");

router.get('/', auth, function(req,res,next) {
    if ((res.locals.role) && ((res.locals.role == 'admin') || (res.locals.role == 'super'))) {
        //console.log(res.locals.role,":register page")
        res.render('register', { title: 'Elections User Registration' })
    }
    else {
        res.redirect('dashboard');
    }
});

module.exports = router;
