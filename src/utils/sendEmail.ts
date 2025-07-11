import { User } from "@/models/User.Model";
import { sendEmailType } from "@/types/types";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export default async function sendEmail({
  email,
  emailType,
  userId,
}: sendEmailType) {
  try {
    const token = await bcrypt.hash(userId, 10);
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          verificationToken: token,
          verificationTokenExpiry: new Date().getTime() + 3600 * 1000,
        },
      }
    );

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "912a24ae083a6f",
        pass: "386d6ff482868a",
      },
    });

    const response = await transport.sendMail({
      from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
      to: email,
      subject:
        emailType == "VERIFY" ? "Verification email" : "Reset password email",
      html: `<p>Click <a href=${process.env.DOMAIN_URI}/api/users/verifyEmail?token=${token}>here</a> to verify your email or copy and past below link in your browser <br> ${process.env.DOMAIN_URI}/api/users/verifyEmail?token=${token}</p>`,
    });

    return response;
  } catch (error: any) {
    console.error(`Error on send email: ${error}`);
    throw new Error(`Error on send email: ${error.message}`);
  }
}
