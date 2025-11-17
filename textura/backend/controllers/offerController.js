import Offer from "../models/Offer.js";
import Subscriber from "../models/Subscriber.js";
import nodemailer from "nodemailer";

export const createOffer = async (req, res) => {
  try {
    const { title, description, category, startDate, endDate } = req.body;

    // Cloudinary image (multer-storage-cloudinary)
    const imageUrl = req.file ? req.file.path : null;

    // Save offer in DB
    const newOffer = await Offer.create({
      title,
      description,
      category,
      startDate,
      endDate,
      image: imageUrl,
    });

    // Get all subscribers
    const subscribers = await Subscriber.find();

    if (!subscribers.length) {
      return res.json({
        success: true,
        message: "Offer saved. No subscribers found.",
      });
    }

    // Nodemailer transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourgmail@gmail.com",
        pass: "your_app_password",
      },
    });

    // Send email to all subscribers
    for (let sub of subscribers) {
      await transporter.sendMail({
        from: '"Textura Offers" <yourgmail@gmail.com>',
        to: sub.email,
        subject: `New Offer: ${title}`,
        html: `
          <h2>${title}</h2>
          <p>${description}</p>
          <p><b>Category:</b> ${category}</p>
          <p><b>Valid:</b> ${startDate} - ${endDate}</p>
          ${
            imageUrl
              ? `<img src="${imageUrl}" alt="${title}" width="300" />`
              : ""
          }
        `,
      });
    }

    res.json({ success: true, message: "Offer created & email sent!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
