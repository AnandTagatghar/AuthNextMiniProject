import { User } from "@/models/User.Model";
import sendEmail from "@/utils/sendEmail";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db_connect from "@/config/dbConnect";

export async function POST(request: NextRequest) {
  try {
    await db_connect();

    const { email, username, password } = await request.json();

    if (!email && !username)
      throw new Error(`Please provide username or email`);
    if (!password) throw new Error(`Please provide password`);

    const checkForUser = await User.findOne({
      $or: [{ email }, { username }],
    });


    if (!checkForUser) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 400,
          message: `Please signup first`,
        },
        { status: 400 }
      );
    }

    if (!checkForUser.isVerified) {
      await sendEmail({
        email,
        emailType: "VERIFY",
        userId: checkForUser._id.toString(),
      });

      return NextResponse.json(
        {
          status: false,
          statusCode: 400,
          message: `Please verify first`,
        },
        { status: 400 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      checkForUser.password
    );
    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 400,
          message: `Please check your credentials`,
        },
        { status: 400 }
      );
    }

    const tokenData = {
      id: checkForUser._id.toString(),
      email: checkForUser.email,
    };
    const token = jwt.sign(tokenData, process.env.JWT_TOKEN_KEY!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      {
        status: true,
        statusCode: 201,
        message: `Login success`,
        token,
      },
      { status: 201 }
    );

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error) {
    console.error(`Error in login controller: ${error}`);
    return NextResponse.json({
      status: false,
      statusCode: 500,
      message: `Error on login controller: ${error}`,
    });
  }
}
