import nodemailer from "nodemailer";

export const sendMail = async (option) => {
   try {
      const transporter = nodemailer.createTransport({
         host: process.env.EMAIL_HOST,
         port: process.env.EMAIL_PORT,
         secure: process.env.EMAIL_PORT === '465', // true for port 465, false for 587
         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
         },
         tls: {
            rejectUnauthorized: false,
            minVersion: "TLSv1.2", // Ensure the correct TLS version is used
         },
      });

      await transporter.verify(); // Test SMTP connection

      const emailOptions = {
         from: "Rupak Develops <rupakchoppala@gmail.com>",
         to: option.email,
         subject: option.subject,
         text: option.message,
      };

      await transporter.sendMail(emailOptions);
      console.log("Email sent successfully!");
   } catch (err) {
      console.error("Error sending email:", err.message);
      throw new Error("Failed to send email");
   }
};
