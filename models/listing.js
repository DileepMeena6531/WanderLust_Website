const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description: String,
    image:{
        type:String,
        default:"https://images.freeimages.com/images/large-previews/f3a/golden-temple-kyoto-1209790.jpg",
        set:(v)=>
            v===""? "https://images.freeimages.com/images/large-previews/f3a/golden-temple-kyoto-1209790.jpg":v,
        },
        price:Number,
        location:String,
        country:String,
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;