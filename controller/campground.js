const Campground = require('../models/Campground/index');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken:mbxToken});

const {cloudinary} = require('../cloudinary/index'); //To delete images from cloudinary
const { UploadStream } = require('cloudinary');

module.exports.index = async (req,res)=>{
    
    const camps = await Campground.find({});
    res.render('./campground/index',{camps:camps});

}


module.exports.new = (req,res)=>{
    res.render('./campground/new');
}

module.exports.show = async(req,res)=>{
    const camp = await Campground.findById(req.params.id)
                    .populate({path:'review',
                     populate:{
                         path:'author'
                     }})
                    .populate('author')
        if(!camp){
            req.flash('error','Cannot find the Campground!');
            return res.redirect('/index');
        }
        res.render('./campground/show',{camp:camp});
}

module.exports.edit = async (req,res)=>{
    
    const camp = await Campground.findById(req.params.id);

    if(!camp){
        req.flash('error','Cannot find the Campground!');
        return res.redirect('/index');
    }
    if(camp.author.equals(req.user._id)){
        res.render('./campground/edit',{camp:camp});
    }else{
        req.flash('error',"You don't have permission to do that!");
        res.redirect(`/index/${req.params.id}`);
    }
}

module.exports.put = async (req,res)=>{
        const camp = req.body.campground;
        const newCamp = await Campground.findByIdAndUpdate(req.params.id,camp);
        const img = req.files.map((f)=>{return{url:f.path,filename:f.filename}}); //separate array for image so that we can spread it 
        newCamp.images.push(...img); //... to spread otherwise we would have been pushing an entire array object into the image field
        await newCamp.save();

        //Check if some images are checked for deletion
        if(req.body.deleteImages){
        //removing those images from mongo whose filename is in deleteImages array (checked images)
        await newCamp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});

        //Now deleting those images from cloudinary as well
        for(let i=0;i<req.body.deleteImages.length;i++){
            await cloudinary.uploader.destroy(req.body.deleteImages[i]);
        }
        // console.log(newCamp);
        }
        req.flash('success','Successfully Updated!')
        res.redirect(`/index/${newCamp._id}`);


}

module.exports.delete = async (req,res)=>{

        //Deleting images associated with campground from cloudinary
        const camp = await Campground.findById(req.params.id);
        for(let i=0;i<camp.images.length;i++){
            await cloudinary.uploader.destroy(camp.images[i].filename);
        }
        console.log("Images deleted");
        await Campground.findByIdAndDelete(req.params.id);
        req.flash('success','Campground deleted')
        res.redirect('/index');
}

module.exports.post = async (req,res)=>{

        const geoData = await geoCoder.forwardGeocode({
            query:req.body.campground.location,
            limit:1
        }).send();
        const location = geoData.body.features[0].geometry; //It will contain a GeoJSON data

        const newCampground = req.body.campground;
        const data = new Campground(newCampground);
        data.geometry = location;
        data.images = req.files.map((f)=>{return {url:f.path,filename:f.filename}});
        data.author = req.user._id;
        await data.save();
        console.log(data);
        req.flash('success','Sucessfully added new Campground!');
        res.redirect(`index/${data._id}`);
}