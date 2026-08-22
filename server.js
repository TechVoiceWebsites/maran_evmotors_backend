import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();
const app = express();

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

console.log("ADMIN_EMAIL exists:", !!ADMIN_EMAIL);
console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://maranevmotors.com',
    'https://www.maranevmotors.com',
    'https://maran-ev-motors.netlify.app'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Contact Section
app.post('/api/contact', async (req, res) => {
  try {
    const {
      firstName,
      email,
      phone,
      subject,
      comments
    } = req.body;

    if (
      !firstName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !subject?.trim() ||
      !comments?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'Maran EV Motors <noreply@maranevmotors.com>',
      to: ADMIN_EMAIL,
      replyTo: email?.trim() || undefined,
      subject: `New Contact Enquiry - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto;">
          <h2 style="color:#1e3a8a;">
            New Contact Enquiry
          </h2>
          <hr />
          <p>
            <strong>Name:</strong>
            ${firstName}
          </p>
          <p>
            <strong>Email:</strong>
            ${email}
          </p>
          <p>
            <strong>Phone:</strong>
            ${phone}
          </p>
          <p>
            <strong>Subject:</strong>
            ${subject}
          </p>
          <p>
            <strong>Message:</strong>
          </p>
          <div style="
            background:#f3f4f6;
            padding:20px;
            border-radius:8px;
          ">
            ${comments}
          </div>
        </div>
      `
    });
    console.log('CONTACT RESEND DATA:', data);
    console.log('CONTACT RESEND ERROR:', error);


    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to send email.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully.'
    });

  } catch (error) {
    console.error('Email error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message.',
    });
  }
});

//Enquiry Form
app.post('/api/enquiryForm', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      city,
      vehicle,
      message
    } = req.body;

    // Required fields
    if (
      !name?.trim() ||
      !phone?.trim() ||
      !city?.trim() ||
      !vehicle?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields.'
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'Maran EV Motors <noreply@maranevmotors.com>',
      to: ADMIN_EMAIL,
      replyTo: email?.trim() || undefined,
      subject: `New Vehicle Enquiry - ${vehicle}`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: 0 auto;
          padding: 20px;
        ">

          <h2 style="color:#1e3a8a;">
            New Vehicle Enquiry
          </h2>

          <hr />

          <p>
            <strong>Name:</strong>
            ${name}
          </p>

          <p>
            <strong>Phone:</strong>
            ${phone}
          </p>

          <p>
            <strong>Email:</strong>
            ${email || 'Not provided'}
          </p>

          <p>
            <strong>City:</strong>
            ${city}
          </p>

          <p>
            <strong>Vehicle:</strong>
            ${vehicle}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <div style="
            background:#f3f4f6;
            padding:20px;
            border-radius:8px;
          ">
            ${message || 'No message provided'}
          </div>

        </div>
      `
    });
    console.log('CONTACT RESEND DATA:', data);
    console.log('CONTACT RESEND ERROR:', error);

    if (error) {
      console.error('Resend enquiry error:', error);

      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to send enquiry.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry sent successfully.'
    });

  } catch (error) {
    console.error('Enquiry error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send enquiry.'
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});