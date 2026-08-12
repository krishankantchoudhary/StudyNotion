const Cart = require("../models/Cart");

exports.cart = async(req,res)=>{
    try{
        const{courseId} = req.body;
        const userId = req.user.id;

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
