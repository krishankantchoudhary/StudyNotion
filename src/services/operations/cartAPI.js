import { apiConnector } from "../apiconnector"
import { cartEndpoints } from "../apis"

const {
  ADD_TO_CART_API,
  GET_CART_API,
  REMOVE_FROM_CART_API
} = cartEndpoints


export const addCourseToCart = async (courseId) => {
  try {
    const response = await apiConnector(
      "POST",
      ADD_TO_CART_API,
      {
        courseId,
      }
    )

    console.log("ADD TO CART RESPONSE:", response)

    return response.data

  } catch (error) {
    console.log(
      "ADD TO CART ERROR:",
      error?.response?.data || error.message
    )

    throw error
  }
}


export const getCart = async () => {
  try {
    const response = await apiConnector(
      "GET",
      GET_CART_API
    )

    console.log("GET CART RESPONSE:", response)

    return response.data

  } catch (error) {
    console.log(
      "GET CART ERROR:",
      error?.response?.data || error.message
    )

    throw error
  }
}

export const removeCourseFromCart = async(courseId)=>{
  try{
    const response = await apiConnector(
      "DELETE",
      REMOVE_FROM_CART_API,
      {
        courseId,
      }
    )
    console.log("REMOVE FROM CART RESPONSE:", response)

    return response.data

  }catch(error){
    console.error(
      "REMOVE FROM CART ERROR:",
       error?.response?.data || error.message
    )
    throw error
  }
}