const RatingAndReview=require("../models/RatingAndReview");
const Course=require("../models/Course");
const { default: mongoose } = require("mongoose");

//1. createRating
exports.createRating=async(req,res)=>{
    try{
        //get userid
        const userId=req.user.id;
        //fetch data from req body
        const{rating,reviews,courseId}=req.body;
        //check if user is enrolled or not
        const courseDetails=await Course.findOne(
                                         {_id:courseId,
                                         studentsEnrolled : {$elemMatch: {$eq: userId}},
                                         });
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"User is not enrolled in this course"
            })
        }                                 
        //check if user already reviewed the course
        const alreadyReviewed=await RatingAndReview.findOne({
                                                user:userId,
                                                course:courseId,
                                          });
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"course is already reviewed by user"
            });
        }
        
        //create rating and review
        const ratingReview= await RatingAndReview.create({
                                                    rating,reviews,
                                                    course:courseId,
                                                    user:userId,
                                                    });
        //update course with this rating/review
        const updateCourse = await Course.findByIdAndUpdate({_id:courseId},
                                                        {
                                                            $push:{
                                                                ratingAndReviews:ratingReview._id,
                                                            }
                                                        },
                                                        {new:true}
        
        )
        console.log(updateCourse);
        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and Reviews created successfully",
            ratingReview
        })                                            
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//2.getAverageRating
exports.getAverageRating=async(req,res)=>{
    try{
        //get course Id
        const courseId=req.body.courseId;
        //calculate avg ratings
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ])
        //return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }
        //if no rating/reviews exist
        return res.status(200).json({
            success:true,
            message:"Average Rating is 0, no ratings given till now",
            averageRating:0,
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong while finding average of reviews"
        })
    }
}

//3.getAllrating
exports.getAllRating=async(req,res)=>{
    try{
        const allReviews = await RatingAndReview.find({})
                                        .sort({rating:"desc"})
                                        .populate({
                                            path:"user",
                                            select:"firstName lastName email image",
                                        })
                                        .populate({
                                            path:"course",
                                            select:"courseName"
                                        })
                                        .exec();
        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data:allReviews
        });                               
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}