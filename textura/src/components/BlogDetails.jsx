import React from "react";
import { useParams } from "react-router-dom";
import "../styles/BlogDetails.css";

import blog1 from "../assets/images/blog1.jpg";
import blog2 from "../assets/images/blog2.jpg";
import blog3 from "../assets/images/blog3.jpg";
import blog4 from "../assets/images/blog4.jpg";

const blogData = {
  1: {
    image: blog1,
    title: "Our Quality Promise",
    content: `
      At Textura, we ensure premium stitching, durable fabrics, and strict QC checks.
      • High-thread-count fabrics  
      • Double-layer stitching  
      • Heat-resistant printing  
    `,
  },
  2: {
    image: blog3,
    title: "About Our Company",
    content: `
      We started with a mission to simplify online fashion.
      • Fast delivery  
      • User-friendly shopping  
      • 24/7 customer support  
    `,
  },
  3: {
    image: blog4,
    title: "Our Achievements",
    content: `
      We continuously innovate to deliver the best customer experience.

      ⭐ Major Achievements:
      • Developed a Virtual Try-On feature using webcam/AI  
      • Introduced 3D cloth preview for better shopping clarity  
      • Launched Razorpay Express Checkout (30 sec payments)  
      • Improved packaging with eco-friendly materials  
      • Built a reward points system to improve user engagement  
      • Created mobile-first UI for faster interactions  
      • Implemented real-time order tracking  

      Our biggest achievement:
      ✓ Virtual Try-On System  
      This feature helps customers try clothes digitally before buying, increasing satisfaction and reducing returns.
    `,
  },
};

const BlogDetails = () => {
  const { id } = useParams();
  const blog = blogData[id];

  if (!blog) return <h2>Blog not found</h2>;

  return (
    <div className="blog-details">
      <img src={blog.image} alt={blog.title} />
      <h1>{blog.title}</h1>
      <p className="content">{blog.content}</p>
    </div>
  );
};

export default BlogDetails;
