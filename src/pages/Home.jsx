import React from "react";
import { lazy, Suspense } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
const CodeBlocks = lazy(() => import("../components/core/HomePage/CodeBlocks"));
const TimelineSection = lazy(
  () => import("../components/core/HomePage/TimelineSection"),
);
const LearningLanguageSection = lazy(
  () => import("../components/core/HomePage/LearningLanguageSection"),
);
const InstructorSection = lazy(
  () => import("../components/core/HomePage/InstructorSection"),
);
const Footer = lazy(() => import("../components/common/Footer"));
const ExploreMore = lazy(
  () => import("../components/core/HomePage/ExploreMore"),
);
const ReviewSlider = lazy(() => import("../components/common/ReviewSlider"));

const Home = () => {
  return (
    <div>
      {/*Section 1*/}
      <div
        className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center
            text-white justify-between px-8"
      >
        <Link to={"/signup"}>
          <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className="text-center font-semibold text-4xl mt-7">
          Empower Your Future with
          <HighlightText text={"Coding-Skills"}></HighlightText>
        </div>

        <div className="mt-4 w-[90%] text-center font-bold text-lg text-richblack-300 ">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>

          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        {/* <div className="mx-3 my-12 shadow-blue-200 "> */}
        <div className="w-full mx-3 my-12 shadow-[12px_12px_0_0] shadow-white-50">
          <video muted controls preload="none">
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/*core section 1*/}
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <CodeBlocks
              position={"lg:flex-row"}
              heading={
                <div className="text-4xl font-semibold">
                  Unlock Your
                  <HighlightText text={"coding potential"} />
                  with our online courses
                </div>
              }
              subheading={
                "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
              }
              ctabtn1={{
                btnText: "Try It Yourself",
                linkto: "/signup",
                active: true,
              }}
              ctabtn2={{
                btnText: "Learn More",
                linkto: "/login",
                active: false,
              }}
              codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\n`}
              codeColor={"text-yellow-25"}
            />
          </Suspense>
        </div>

        {/*core section 2*/}
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <CodeBlocks
              position={"lg:flex-row-reverse"}
              heading={
                <div className="text-4xl font-semibold">
                  Start
                  <HighlightText text={"coding in seconds"} />
                </div>
              }
              subheading={
                "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
              }
              ctabtn1={{
                btnText: "Continue Lesson",
                linkto: "/signup",
                active: true,
              }}
              ctabtn2={{
                btnText: "Learn More",
                linkto: "/login",
                active: false,
              }}
              codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\n`}
              codeColor={"text-yellow-25"}
            />
          </Suspense>
        </div>
        {/* CARD SECTION: Explore more ,,,For this we make separate component*/}
        <Suspense fallback={<div>Loading...</div>}>
          <ExploreMore />
        </Suspense>
      </div>

      {/*Section 2*/}

      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[310px]">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto px-8">
            <div className="h-[160px]"></div>
            <div className="flex flex-row gap-7 text-white">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-3">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/signup"}>
                <div>Learn More</div>
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7 px-8">
          <div className="flex flex-row gap-10 mb-10 mt-[95px]">
            <div className="text-4xl font-semibold w-[45%]">
              Get the Skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>

            <div className="flex flex-col gap-10 w-[40%] items-start">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div>Learn more</div>
              </CTAButton>
            </div>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <TimelineSection />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <LearningLanguageSection />
          </Suspense>
        </div>
      </div>

      {/*Section 3*/}

      <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <InstructorSection />
        </Suspense>

        <h2 className="text-center text-4xl font-semobold mt-10">
          Review from Other Learners
        </h2>
        <Suspense fallback={<div>Loading...</div>}>
          <ReviewSlider />
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Home;
