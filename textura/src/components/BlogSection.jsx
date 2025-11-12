import React from "react";
import "../styles/BlogSection.css";
import blog1 from "../assets/images/blog1.jpg";
import blog2 from "../assets/images/blog2.jpg";
import blog3 from "../assets/images/blog3.jpg";

const BlogSection = () => {
  const blogs = [
    {
      id: 1,
      image: blog1,
      title: "Our Quality Promise",
      text: "We ensure top fabric and stitching.",
    },
    {
      id: 2,
      image: blog2,
      title: "Affordable Fashion",
      text: "Premium looks at minimal prices.",
    },
    {
      id: 3,
      image: blog3,
      title: "About Our Company",
      text: "Learn our story and vision.",
    },
  ];

  return (
    <section className="blogs">
      <h2>From Our Blog</h2>
      <div className="blog-container">
        {blogs.map((b) => (
          <div key={b.id} className="blog-card">
            <img src={b.image} alt={b.title} />
            <h3>{b.title}</h3>
            <p>{b.text}</p>
            <button className="read-btn">Read More</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
