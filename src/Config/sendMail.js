import nodemailer from "nodemailer";
import Mailgen from "mailgen";

export const sendEmail = async(req, res) => {
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_APP_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    }
    console.log(req.body.receive_email);
    let transporter = nodemailer.createTransport(config);


    let message = {
        from: process.env.GMAIL_APP_USER, // sender address
        to: req.body.receive_email, // list of receivers
        subject: 'Welcome to ABC Website!', // Subject line
        html: "<b>Hello Teman Baik</b>", // html body

    }

    transporter.sendMail(message).then((info) => {
        return res.status(201).json({
            message: "Email Sent",
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        });
    }).catch((err) => {
        console.error("error when sending email: " + err);
        return res.status(500).json({msg: err});
    });
}

export const sendCodeVerification = async(name, email, code)  => {
    try {
        let config = {
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_APP_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        }
    
        let transporter = nodemailer.createTransport(config);
    
        let MailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Library Express',
                link: 'http://localhost:3000'
            }
        });
    
        let response = {
            body: {
                name: name, // pastikan variabel 'name' terdefinisi
                intro: `Hi ${name}, we're excited to have you on board!`,
                table: {
                    data: [
                        {
                            'Verification Code': `<div style="font-size: 30px; font-weight: bold; color: #22BC66;">${code}</div>`
                        }
                    ],
                    columns: {
                        customWidth: {
                            'Verification Code': '50%'
                        },
                        customAlignment: {
                            'Verification Code': 'center'
                        }
                    }
                },
                // Menghapus action dengan tombol
                outro: 'If you did not request this, you can safely ignore this email.'
            }
        };
        
    
        let mail = MailGenerator.generate(response);
    
        let message = {
            from: 'process.env.GMAIL_APP_USER',
            to: email,
            subject: 'Verification Code',
            html: mail,
        };
    
        await transporter.sendMail(message);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}