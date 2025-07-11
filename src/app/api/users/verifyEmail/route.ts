import db_connect from "@/config/dbConnect";
import { User } from "@/models/User.Model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await db_connect();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    if (!token) throw new Error(`Token is missing`);

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json({
        status: false,
        statusCose: 403,
        message: `Invaid token passed`,
      });
    }

    const isTokenExpired = Number(user.verificationTokenExpiry) < Date.now();

    if (isTokenExpired) {
      return NextResponse.json(
        { statusCode: 404, status: false, message: `Token expired` },
        { status: 404 }
      );
    }

    await User.findByIdAndUpdate(user._id, { $set: { isVerified: true } });

    return NextResponse.json(
      { status: true, statusCode: 201, message: `Verification success` },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: `Error on verify email controller: ${error}`,
      },
      { status: 500 }
    );
  }
}
