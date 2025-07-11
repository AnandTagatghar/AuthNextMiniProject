import { User, UserSchemaInterface } from "@/models/User.Model";
import { tokenType } from "@/types/types";
import { verify } from "jsonwebtoken";

export default async function getDataFromToken(token: string) {
  try {
    const payload = verify(token, process.env.JWT_TOKEN_KEY!) as tokenType;

    const user: UserSchemaInterface = await User.findById(payload.id).select(
      "-password"
    );

    if (!user) throw new Error(`User not found`);

    return user;
  } catch (error: any) {
    console.error(`Error on fetch token details: ${error}`);
    throw new Error(error?.message || error);
  }
}
