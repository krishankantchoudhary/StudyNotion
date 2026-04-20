import React from 'react'

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"

import {FreeMode, Pagination } from "swiper/modules"

import CourseCard from './Course_Card'

const CourseSlider = ({ Courses }) => {
  //  console.log("course ki length:",Courses.length)
  //  console.log("Courses:", Courses);
  // console.log("Length:", Courses?.length);
  return (
    <>
      {
        Courses?.length ? (
         
          <Swiper
            slidesPerView={1}
            loop={true} 
            spaceBetween={25}
            // pagination={{ clickable: true }}
            modules={[ FreeMode, Pagination]}
            className="max-h-[30rem]"
            breakpoints={{
              1024: { slidesPerView: 3 }
            }}

          >
            {
              Courses?.map((course, index) => (
                <SwiperSlide key={index}>
                  <CourseCard course={course} Height={"h-[250px]"} />
                </SwiperSlide>
              ))
            }
          </Swiper>
        ) : (
          <p className="text-xl text-richblack-5">No Course Found</p>
        )
      }
    </>
  )
}

export default CourseSlider