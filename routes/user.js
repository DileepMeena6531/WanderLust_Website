 const express= require("express");
 const router=express.Router();
 const User=require("../models/user.js");
 const wrapAsync=require("../utils/wrapAsync.js");
 const passport=require("passport");
 const {saveRedirectUrl}=require("../middleware.js");

 //signUp:
 router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
 });

 router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        const registerUser=await User.register(newUser,password);
        req.login(registerUser,(err)=>{
         if(err){
            next(err);
         }
         req.flash("success","welcome to wandrlust!");
         res.redirect("/listings"); 
        });
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
 }));

 //Log in:
 router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
 });

 router.post('/login', saveRedirectUrl,
  passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
  async(req, res)=> {
    req.flash("success","welcome back to wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  });

  router.get("/logout",(req,res,next)=>{
   req.logout((err)=>{
      if(err){
         return next(err);
      }
      req.flash("success","you are logout:");
      res.redirect("/listings");
   });
  });

 module.exports=router;