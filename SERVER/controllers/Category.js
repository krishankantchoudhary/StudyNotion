

const Category = require("../models/Category");
function getRandomInt(max){
  return Math.floor(Math.random()*max)
}




//handler function for createCategory
exports.createCategory = async (req, res) => {
  try {
    //fetch data from req body
    const { name, description } = req.body;
    console.log(name, description);
    //validation exist or not
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "all filled required",
      });
    }
    //db m entry
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log("categorydeatails:", categoryDetails);

    return res.status(201).json({
      success: true,
      message: "Category created successful",
      data:categoryDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//handler function for get AllTag

exports.showAllCategory = async (req, res) => {
  try {
     console.log("INSIDE SHOW ALL CATEGORIES");
    const allCategoryDetail = await Category.find(
      {},
      //{ name: true, description: true },
    )
     .populate({
        path: "courses",
        match: { status: "Published" },
      });

      console.log("saricategory details",JSON.stringify(allCategoryDetail, null, 2));

    return res.status(200).json({
      success: true,
      message: "All category details fetch Successfully",
      data: allCategoryDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//categoryPAgeDetails
exports.categoryPageDetails = async (req, res) => {
  try {
    //get categoryId
    const { categoryId } = req.body;
    console.log("PRINTING CATEGORY ID: ", categoryId);
    //get courses for specified categoryId
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path:"courses",
        match:{status:"Published"},
        populate:"ratingAndReviews",
      })
      .exec();

    //validation
    //handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.")
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    //handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }


    //get courses for diffrent categories which is exceptSelected
    const diffrentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
    let differentCategory = await Category.findOne(
      diffrentCategories[getRandomInt(diffrentCategories.length)]
      ._id
    )
      .populate({
        path:"courses",
        match:{status:"Published"},
      })
      .exec();

    //GET top selling courses 
    const allCategories=await Category.find()
    .populate({
      path:"courses",
      match:{status:"Published"},
      populate:{
        path:"instructor",
      },
    })
    .exec()

    const allCourses=allCategories.flatMap((category)=>category.courses)
    const mostSellingCourses=allCourses
    .sort((a,b)=>b.sold - a.sold)
    .slice(0,10)

    //return response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
