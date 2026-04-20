
// const SubSection = require("../models/Subsection")
// const CourseProgress = require("../models/CourseProgress")


// exports.updateCourseProgress = async (req, res) => {
//   const { courseId, subSectionId } = req.body
//   const userId = req.user.id

//   try {
//     // Check if the subsection is valid
//     const subSection = await SubSection.findById(subSectionId)
//     if (!subSection) {
//       return res.status(404).json({ error: "Invalid subsection" })
//     }
//     console.log("SubSection Validation Done");

//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//             courseId:courseId,
//             userId:userId,
//         });
//         if(!courseProgress) {
//           courseProgress = await CourseProgress.create({ 
//             courseId: courseId, 
//             userId: userId, 
//             completedVideos: [subSectionId], 
//           })
//             return res.status(200).json({
//                 success:true,
//                 message:"Course progress created and updated",
//             });
//         }

//         //if course progress exist check if the subsestion is already completed
//         const alreadyCompleted=courseProgress.completedVideos.some(
//           (id)=>id.toString()===subSectionId
//         )

//         if(alreadyCompleted){
//           return res.status(400).json({
//             success:false,
//             message:"Subsection already completed",
//           })
//         }

//         //push the subsection into the completedvideos array
//         courseProgress.completedVideos.push(subSectionId)

//         //save the updated course progress
//         await courseProgress.save();

//         return res.status(200).json({
//           success:true,
//           message:"Course progress updated"
//         })
//       }catch(error){
//         console.error(error)
//         return res.status(500).json({
//           error:"internl server error"
//         })
//       }

//     }



       const SubSection = require("../models/Subsection")
const CourseProgress = require("../models/CourseProgress")

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body
  const userId = req.user.id

  try {
    // Check if the subsection is valid
    const subSection = await SubSection.findById(subSectionId)
    if (!subSection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    // 🔥 CHANGE 1: use findOneAndUpdate (no race condition)
    let courseProgress = await CourseProgress.findOneAndUpdate(
      { courseId: courseId, userId: userId },
      {
        $setOnInsert: {
          courseId: courseId,
          userId: userId,
          completedVideos: [],
        },
      },
      { new: true, upsert: true }
    )

    // 🔥 CHANGE 2: check duplicate safely
    const alreadyCompleted = courseProgress.completedVideos.some(
      (id) => id.toString() === subSectionId
    )

    if (alreadyCompleted) {
      return res.status(400).json({
        success: false,
        message: "Subsection already completed",
      })
    }

    // 🔥 CHANGE 3: use $addToSet (no duplicate push)
    await CourseProgress.findOneAndUpdate(
      { courseId: courseId, userId: userId },
      {
        $addToSet: { completedVideos: subSectionId },
      }
    )

    return res.status(200).json({
      success: true,
      message: "Course progress updated",
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: "internal server error",
    })
  }
}