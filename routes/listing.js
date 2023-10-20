const express= require("express");
const router=express.Router();
const Listing= require("../models/listing.js");
const {listingSchema}=require("../schema.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLogedIn,isOwner,validateListing}=require("../middleware.js");

 //Index route
 router.get("/",wrapAsync(async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
  }));
  //New route:
  router.get("/new",isLogedIn,(req,res)=>{
    res.render("listings/new.ejs");
  })

  //Show route:
  router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
        path:"author"
      },
    })
    .populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for Does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
  }));

  //Create route:
  router.post("/",isLogedIn,validateListing,wrapAsync(async (req,res,next)=>{
    // if(!req.body.listing){
    //   throw new ExpressError(400,"send valid data for listing");
    // }
      const newListing=new Listing(req.body.listing);
      newListing.owner=req.user._id;
      await newListing.save();
      req.flash("success","new listing created!");
      res.redirect("/listings");
  }));

  //edit route:
  router.get("/:id/edit",isLogedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested Does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
  }));

  //Update route:
  router.put("/:id",isLogedIn,isOwner,validateListing,wrapAsync(async (req,res,next)=>{
    // if(!req.body.listing){
    //   throw new ExpressError(400,"send valid data for listing");
    // }
      let {id}=req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      req.flash("success","Edit Listing!");
      res.redirect(`/listings/${id}`);
  }));

  //Delete route:
  router.delete("/:id",isLogedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletListing=await Listing.findByIdAndDelete(id);
    console.log(deletListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
  }));

  module.exports=router;