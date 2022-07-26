import nodemailer from 'nodemailer';

export default {

    // Email sender
    sendMessage: async function (from, to , message) {

        // Send email
        const emailObject = {
            from: process.env.EMAIL,
            to: to.email,
            subject: `New Message from ${from.name}`,
            text: `${from.name} Sent:\n${message}`
        }

        const transporter = nodemailer.createTransport({
            service: "outlook",
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        let res = await transporter.sendMail(emailObject)
        
    }

}