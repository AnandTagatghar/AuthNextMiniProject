import { User, UserSchemaInterface } from "@/models/User.Model";
import db_connect from "@/config/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import sendEmail from "@/utils/sendEmail";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await db_connect();

    let body;
    try {
      body = await request.json();
    } catch (error: any) {
      throw new Error(`Please provide body`);
    }

    const { username, password, email } = body;

    if (!username) throw new Error(`Please provide username`);
    if (!password) throw new Error(`Please provide password`);
    if (!email) throw new Error(`Please provide email`);

    const checkForUser: UserSchemaInterface = await User.findOne({
      $or: [{ username }, { email }],
    }).select("-password");

    if (checkForUser && checkForUser.isVerified) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 404,
          message: `User already exists`,
        },
        { status: 404 }
      );
    } else if (checkForUser && !checkForUser.isVerified) {
      await sendEmail({
        email,
        emailType: "VERIFY",
        userId: checkForUser._id.toString(),
      });

      return NextResponse.json(
        {
          status: false,
          statusCode: 400,
          message: `Please verify your email`,
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await sendEmail({ email, emailType: "VERIFY", userId: newUser._id.toString() });

    await newUser.save();

    return NextResponse.json(
      {
        status: true,
        statusCode: 201,
        message: `User registered, please verify your user`,
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: `Error on signup controller: ${error}`,
      },
      { status: 500 }
    );
  }
}
