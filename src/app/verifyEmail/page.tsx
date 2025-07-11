"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyEmailpage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loader, setLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!token) {
    toast.error(`Please copy url from the email`);
    return <>
    <div>token required</div>
    </>;
  }

  const sleep = async (ms: number) => {
    await new Promise((res) => setTimeout(res, ms));
    return;
  };

  const handleVerifyEmail = async () => {
    setLoader(true);
    try {
      const response = await axios.get(`/api/users/verifyEmail?token=${token}`);

      if (response.data.status) {
        setSuccess(true);
        await sleep(2000);
        toast.success(`Verification success`);
        router.push("/profile");
      } else {
        setFailed(true);
        toast.error(`Verification failed: ${response.data.message}`);
      }
    } catch (error: any) {
      setLoader(false);
      setErrorMsg(error.response.data.message);
      setFailed(true);
      toast.error(
        `Something went wrong: ${error.response.data.message || error.message}`
      );
    }
  };

  useEffect(() => {
    handleVerifyEmail();
  }, []);

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        {success && (
          <h1 className="text-3xl font-bold">Verification success</h1>
        )}

        {failed && (
          <h1 className="text-3xl text-red-400 font-bold">
            Verification Failed {`: ${errorMsg}`}
          </h1>
        )}

        {loader && (
          <button
            type="button"
            className=" text-white font-bold rounded-lg py-1 px-2"
            disabled
          >
            <span className="mr-3 size-5 animate-spin inline-block rounded-full text-white border-t-[5] border-white"></span>
            Processing…
          </button>
        )}
      </div>
    </>
  );
}
