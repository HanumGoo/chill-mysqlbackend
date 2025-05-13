
import nodemailer from 'nodemailer';




export async function sendEmail( email, verify_token ) {

    const verifyPath = `http://localhost:3000/api/user/login/verify-email?email=${email}&token=${verify_token}`;

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'estelle.oconnell64@ethereal.email',
        pass: 'wTmteZcvBtbkStZHQ7'
    }
});

const mailOptions = {
    from: 'estelle.oconnell64@ethereal.email',
    to: email,
    subject: 'Verification Email',
    text: 'This is the link for your email verification!\nverifyPath\nif youre not the one who request this, just ignore it',
    html: `<h1>Verification Email</h1><p>This is the link for your email verification!</p><a href="${verifyPath}">Click Here!</a><p>if youre not the one who request this, just ignore it</p>`
};
const result = await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error sending email:', error);
        return false;
    } else {
        console.log('Email sent:', info.response);
        return true;
    }
});

return result;

};

export default sendEmail;
