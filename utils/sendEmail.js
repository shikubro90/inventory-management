const nodemailer = require("nodemailer")

const sendEmail = async (subject, message, send_to, sent_from, reply_to)=>{
    // Create email transporter 
    const transporter = nodemailer.createTransport({
        host : process.env.EMAIL_HOST,
        port : 587,
        auth: {
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS
        },
        tls : {
            rejectUnauthorized : false
        }
    })
}