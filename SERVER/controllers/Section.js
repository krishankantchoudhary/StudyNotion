const Section=require("../models/Section")
const Course=require("../models/Course");
const SubSection= require("../models/SubSection")

//create handler function for section

exports.createSection=async(req,res)=>{
    try{
        //fetch data
        //courseId isliye kyoki bad m iss new section ko course m bhi update katna padega na
        const{sectionName, courseId}=req.body;
        //validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }

        // check course exists
    const courseDetails = await Course.findById(courseId);
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

        //create new section
        const newSection=await Section.create({sectionName, course: courseId,});
        //update newsection in course
        const updatedCourseDetails=await Course.findByIdAndUpdate(
                                                        courseId,
                                                        {
                                                            $push:{
                                                                courseContent:newSection._id
                                                            },
                                                        },
                                                        {new:true},
                                                    )
                                                    .populate({
                                                        path:"courseContent",
                                                        populate:{
                                                            path:"subSection",
                                                        },
                                                    })  
                                                    .exec(); 
        //return resonse
        return res.status(200).json({
            success:true,
            message:"new section created and updated in course{courseContent with objectId} successfully",
            data:updatedCourseDetails,
        })                                            
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while creating new section",
            error:error.message,
        })
    }
}

//update handler function for section

exports.updateSection=async(req,res)=>{
    try{
        //fetch section for updating
        const{sectionName,sectionId, courseId}=req.body;
        //validation
        if(!sectionName || !sectionId || !courseId){
            return res.status(400).json({
                success:false,
                message:"some properties are missing"
            })
        }
        //updateData
        const section = await Section.findByIdAndUpdate(sectionId,
                                        {sectionName}, //wo new sectionName jo request m ayyyi hai
                                        {new:true}
        )

        const course = await Course.findById(courseId)
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },
        })
        .exec();
        //retrun response
        return res.status(200).json({
            success:true,
            message:"section updated successfully:",section,
            data:course,
        })

    }catch(error){
        console.error("Error updationg section:",error);
        return res.status(500).json({
            success:false,
            message:"something went wrong while updating section",
        })
    }
}

// delete handler function for section

exports.deleteSection=async(req,res)=>{
    try{
        //fetch karo jisse delete karna hai basis of sectionId
        const{sectionId, courseId}=req.body;
        //deelet karo
        await Course.findByIdAndUpdate(courseId,{
            $pull: {
                courseContent: sectionId,
            }
        })
        const section = await Section.findById(sectionId);
        console.log(sectionId, courseId);
        if(!section){
            return res.status(404).json({
                success:false,
                message:"Section not found",
            })
        }


        //delete sub section
        await SubSection.deleteMany({_id: {$in: section.subSection}});

        await Section.findByIdAndDelete(sectionId);

        //find the updated course and return
        const course = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        })
        .exec();

        //return res
        return res.status(200).json({
            success:true,
            message:"section delete successfully",
            data:course
        });
    }catch(error){
        console.error("Error deleting section",error);
        return res.status(500).json({
            success:false,
            message:"something went wrong while deleting section"
        });
    }
};