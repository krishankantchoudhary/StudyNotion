require("dotenv").config();
const Section=require("../models/Section");
const SubSection=require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create handler for subsection
exports.createSubSection=async(req,res)=>{
    try{
        //fetch data from req body
        const{sectionId, description, title}=req.body;
        //extract file/video from .files
        const video=req.files.video;
        //validation
        if(!sectionId || !description || !title || !video){
            return res.status(404).json({
                success:false,
                message:"all fieds are required",
            })
        }
        //upload video to cloudinary
        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create Subsection
        const subSectionDetails=await SubSection.create({
                                                title:title,
                                                description:description,
                                                timeDuration:`${uploadDetails.duration}`,
                                                videoUrl:uploadDetails.secure_url,
        })
        //update section with this subsection objectId
        const updatedSection = await Section.findByIdAndUpdate(
                                                    {_id:sectionId},
                                                    {
                                                        $push:{
                                                            subSection:subSectionDetails._id
                                                        }
                                                    },
                                                    {new:true}
                                                ).populate("subSection")
        //return response
        return res.status(200).json({
            success:true,
            message:"subsection crated succesfully",
            data:updatedSection,
        })                                        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong while creating subsection",
            error:error.message,
        })
    }
}

//update handler for subsection
exports.updateSubSection=async(req,res)=>{
    try{
        //fetch karo subsectionName or sectionId
        const{sectionId, subSectionId, title, description,}=req.body;
        //update karo 
        const subSection=await SubSection.findById(subSectionId)

        if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()

      //section ko update karo
      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
        //return response
        return res.status(200).json({
            success:true,
            data:updatedSection,
            message:"subsection is updated successfully"
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong while updating subsection"
        })
    }
}

//delete handler for subsection

exports.deleteSubSection=async(req,res)=>{
    try{
        //fetch karo isse delete karna hai
        const{subSectionId, sectionId}=req.body;
        //delet karo
        await Section.findByIdAndUpdate({_id:sectionId},
                                        {
                                            $pull:{
                                                subSection:subSectionId,
                                            }
                                        }
        )
        const subSection = await SubSection.findByIdAndDelete({_id:subSectionId})

        if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      //update karo section ko
      const updatedSection= await Section.findById(sectionId).populate("subSection")
        //return response
        return res.status(200).json({
            success:true,
            data:updatedSection,
            message:"subsection deleted successfully"
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong while deleting subsection"
        })
    }
}