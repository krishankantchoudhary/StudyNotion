const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress");


const Course = require("../models/Course");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

const { convertSecondsToDuration } = require("../utils/secToDuration");
require("dotenv").config();

//update Profile handler function
exports.updateProfile = async (req, res) => {
  try {
    //fetch karo
    const {
      gender,
      contactNumber,
      dateofbirth = "",
      about = "",
      firstName,
      lastName,
    } = req.body;
    //userid fetch karo
    const id = req.user.id;
    //validation
    if (!gender || !contactNumber || !id) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }
    //find profile but we dont have profileId yet, so firslty we find user details
    //coz we have userId
    const userDetails = await User.findById(id);
    console.log("ye hai userDetails:", userDetails);
    //now in this userDetails we have profile details inside it
    //find profileID inside user
    const profileId = userDetails.additionalDetails;
    console.log("ye hai profileId", profileId);
    //find profileDetails using profileId
    const profileDetails = await Profile.findById(profileId);
    console.log("ye hai profileDetails", profileDetails);
    //then update all profileDEtails karo
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    profileDetails.dateofbirth = dateofbirth;
    profileDetails.about = about;
    await profileDetails.save();

    console.log("ye hai profileDetailsSaved", profileDetails);

    //update user
    if (firstName) userDetails.firstName = firstName;
    if (lastName) userDetails.lastName = lastName;
    await userDetails.save();

    //send updated USER (not only profile)
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    console.log("ye hai updatedUserDetails", updatedUserDetails);

    //return response
    return res.status(200).json({
      success: true,
      message: "profile updated sucessfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while updating profile",
    });
  }
};

//delete handler for profile
exports.deleteAccount = async (req, res) => {
  try {
    //get id
    const id = req.user.id;
    //validation
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "user not found with this id",
      });
    }
    //delete profile
    await Profile.findByIdAndDelete(userDetails.additionalDetails);

    //HW: unenrolled user from all enrolled courses

    //delete User
    await User.findByIdAndDelete(id);

    //return res
    return res.status(200).json({
      success: true,
      message: "account deleted succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something wrong ehile deleting account",
    });
  }
};

//getAll users details

exports.getAllUserDetails = async (req, res) => {
  try {
    //get user id
    const id = req.user.id;
    //validate karo
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    //return res
    return res.status(200).json({
      success: true,
      message: "all details fetch successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong while fetching all user details",
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  console.log("REQ.USER:", req.user);
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000,
    );
    console.log(image);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true },
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

      console.log("userdetails aa gaya",userDetails)
    userDetails = userDetails.toObject();
    var SubsectionLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0,
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds,
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
       courseId:userDetails.courses[i]._id,
  userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos?.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier,
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      };

      return courseDataWithStats;
    });

    res.status(200).json({ 
      data: courseData 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
