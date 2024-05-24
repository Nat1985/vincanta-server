import nodemailer from 'nodemailer';

export const sendMail = async (emailUrl, emailHtmlBody) => {
    const infoTransporter = nodemailer.createTransport({
        host: process.env.SITEGROUND_DOMAIN_HOST,
        port: process.env.SITEGROUND_DOMAIN_PORT,
        secure: true,
        auth: {
            user: 'info@andreanatale.com',
            pass: process.env.SITEGROUND_DOMAIN_ANDREANATALE_PASSWORD
        }
    })

    await infoTransporter.sendMail({
        from: 'Andrea Natale <info@andreanatale.com',
        to: emailUrl,
        subject: 'Vincanta - Reset della password',
        html: emailHtmlBody
    })
}
