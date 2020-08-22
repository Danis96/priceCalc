require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service:'gmail',
    auth : {
        user :process.env.EMAIL,
        pass :process.env.PASSWORD,
    }
});

let mailoptions = {
    from : 'tech387@example.com',
    to: 'amerfsk@gmail.com',
    subject : 'testing',
    text : 'it works'
}

transporter.sendMail(mailoptions , (err, data) => {
    if(err){
        console.log('Error!!', err)
    }else{
        console.log('Email sent!')
    }
})