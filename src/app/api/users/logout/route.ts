import db_connect from "@/config/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await db_connect();
    
    const response = NextResponse.json(
      { status: true, statusCode: 201, message: `Logout success` },
      { status: 201 }
    );
    response.cookies.delete("token");
    return response;
  } catch (error) {
    return NextResponse.json({
      status: false,
      statusCode: 500,
      message: `Error on logout controller: ${error}`,
    });
  }
}
