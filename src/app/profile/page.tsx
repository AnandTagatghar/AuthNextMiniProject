"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoader(true);
    try {
      const logoutResponse = await axios.get("/api/users/logout");

      if (logoutResponse.data.status) {
        toast.success(`Logout success`);
        router.push("/");
      } else {
        toast.error(`Logout failed: ${logoutResponse.data.message}`);
      }
    } catch (error: any) {
      toast.error(
        `Something went wrong: ${error.response.data.message || error.message}`
      );
    }
    setLoader(false);
  };
  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="border-2 border-[#813CB9] p-10 rounded">
          <h1 className="text-bold text-3xl text-[#D8C1EB]">Profile Page!</h1>
          <h1></h1>
          {!loader && (
            <button
              className="w-full text-center mt-10 block bg-[#C5A3E1] rounded-lg py-1 px-2 text-xl text-black font-semibold focus:outline-none active:bg-[#813CB9] hover:cursor-pointer"
              onClick={handleLogout}
            >
              LogOut!
            </button>
          )}

          {loader && (
            <button
              type="button"
              className="bg-[#C5A3E1] text-black font-bold rounded-lg py-1 px-2"
              disabled
            >
              <span className="mr-3 size-5 animate-spin inline-block rounded-full text-black border-t-[5] border-black"></span>
              Processing…
            </button>
          )}
        </div>
      </div>
    </>
  );
}
