const Cart = require("../models/Cart");
const Course = require("../models/Course");

exports.cart = async(req,res)=>{
    try{
        const{courseId} = req.body;
        const userId = req.user.id;

        //courseId ke basis par course documnet m check karo ki ye course 
        // h ya nhi phir bad m uska price lelenge
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success:false,
                message:"Course not found"
            });
        }

        let cart = await Cart.findOne({user:userId});

        if(!cart){
            cart = await Cart.create({
                user : userId,
                courses : [courseId]
            })

            return res.status(200).json({
                success:true,
                data:cart,
                message:"course added in cart successfully"
            })
        }

        if(cart.courses.includes(courseId)){
            return res.status(400).json({
                success:false,
                message:"course already in cart"
            })
        }

        cart.courses.push(courseId);
        cart.totalAmount += course.price;
        await cart.save();

        res.status(200).json({
            success:true,
            data:cart,
            message:"course added in cart succefully"
        })


    }catch(error){
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
    }
}

// controllers/Cart.js

exports.getCart = async (req, res) => {
    try {
        
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId })
            .populate("courses");

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: {
                    courses: [],
                    totalAmount: 0
                },
                message: "Cart is empty"
            });
        }

        return res.status(200).json({
            success: true,
            data: cart,
            message: "Cart fetched successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.removefromCart = async(req,res)=>{
    try{
    const{courseId}=req.body;
    const userId = req.user.id;
    console.log(courseId);

    //1. userId se cart m iss user ko find kiya or populate kiya jisse courses ki details mil sake
    // const cart = await Cart.findOne({user:userId}).populate("courses");

    //2. cart m user tho hai but uske courses m ye course hai ya nhi?
    // const course = cart.courses.find(
    //     (course)=>course._id.toString() === courseId
    // )

    // if(!course){
    //     return res.status(404).json({
    //         success:false,
    //         message:"Course is not in cart"
    //     })
    // }

    // cart.courses.pull(courseId);
    // cart.totalAmount -= course.price;

    // if(cart.courses.length === 0){
    //     cart.totalAmount = 0;
    // }

    // await cart.save();

     // 1. Course DB mein check
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

    //check ki ye course DB m hai bhi hai nhi
    const cart = await Cart.findOneAndUpdate(
        {user:userId},
        {
            $pull:{
                courses:courseId
            }
             
        },
        
        {
            new:true
        }
    )

    if(!cart){
        return res.status(404).json({
            success:false,
            message:"Course not found in DB"
        })
    }

    if (cart.courses.length === 0) {
    cart.totalAmount = 0;
} else {
    cart.totalAmount -= course.price;
}
    
    // 4. DB mein save
        await cart.save();

   
    res.status(200).json({
        success:true,
        message:"Course delete succesfully"
    })

    }catch(error){
         console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
   
    
}
