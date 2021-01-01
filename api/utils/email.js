const nodemailer= require('nodemailer')

// using mailtrap as a fake email sending service
const sendEmail= async(options)=>{

    //1- create a teansporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
    });


    //2- define email options
    const mailOptions={
        from:'Gitarackur <dajukee@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html
    }

    //3- actually send the email
    await transporter.sendMail(mailOptions)
}

module.exports= sendEmail;