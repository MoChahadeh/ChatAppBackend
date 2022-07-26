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
        
    },

    // Send Verification Email
    sendVerification: async function (email, token) {
            
            // Send email
            const emailObject = {
                from: process.env.EMAIL,
                to: email,
                subject: "Verify your email",
                text: `Please verify your email by clicking the link below:\nhttps://chatappmc.herokuapp.com/api/verify/${token}`
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