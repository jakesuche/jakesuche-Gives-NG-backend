const nodemailer= require('nodemailer')
const pug= require('pug')
const htmlToText= require('html-to-text')




module.exports= class Email{
    constructor(user, url){
        this.to= user.email,
        this.firstname= user.name.split(' ')[0],
        this.url= url,
        this.from= `Gitarackur <${process.env.EMAIL_FROM}>`
    }

    newTransport(){
        if(process.env.NODE_ENV==="production"){
            // sendGrid
            // return nodemailer.createTransport({
            //     service:'SendGrid',
            //     auth: {
            //         user: process.env.SENDGRID_USERNAME,
            //         pass: process.env.SENDGRID_PASSWORD
            //     }
            // });
            // gmail as alt
            return nodemailer.createTransport({
                service:'Gmail',
                auth: {
                    user: process.env.GMAIL_USERNAME,
                    pass: process.env.GMAIL_PASSWORD
                }
            });
        }

        // return nodemailer.createTransport({
        //     host: process.env.EMAIL_HOST,
        //     port: parseInt(process.env.EMAIL_PORT),
        //     auth: {
        //         user: process.env.EMAIL_USERNAME,
        //         pass: process.env.EMAIL_PASSWORD
        //     }
        // });

        return nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "c34b024c63ce99",
              pass: "963dda5ff24e3a"
            }
        });
        
    }

    async send(template, subject){
        //  render html based on a pug template
        const html= pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstname: this.firstname,
            url: this.url,
            subject
        })

        // define the email options
        const mailOptions={
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.htmlToText(html)
        }

        // create  a transport and send email
        
        await this.newTransport().sendMail(mailOptions)
    }

    async sendWelcome(){
        await this.send('welcome', 'welcome to the natours family')
    }
    
    async sendPasswordReset(){
        await this.send('passwordReset', 'your password reset token is only avaliable for 10 mins')
    }
}








// // using mailtrap as a fake email sending service
// const sendEmail= async(options)=>{

//     //1- create a teansporter
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//           user: process.env.EMAIL_USERNAME,
//           pass: process.env.EMAIL_PASSWORD
//         }
//     });


//     //2- define email options
//     const mailOptions={
//         from:'Gitarackur <dajukee@gmail.com>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         // html
//     }

//     //3- actually send the email
//     await transporter.sendMail(mailOptions)
// }

// module.exports= sendEmail;