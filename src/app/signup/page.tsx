"use client";
import axios from "axios";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

export default function SignUpPage() {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [fillOptions, setFillOptions] = useState(false);
  const [isSignUpDisabled, setIsSignUpDisabled] = useState(true);
  const [loader, setLoader] = useState(false);

  const firstRun = useRef(false);

  useEffect(() => {
    if (firstRun.current) {
      if (!user.username || !user.email || !user.password) {
        setFillOptions(true);
        setIsSignUpDisabled(true);
      } else {
        setFillOptions(false);
        setIsSignUpDisabled(false);
      }
    } else {
      firstRun.current = true;
    }
  }, [user]);

  const handleSignUp = async () => {
    setLoader(true);
    setIsSignUpDisabled(true);
    try {
      const response = await axios.post("/api/users/signup", {
        username: user.username,
        password: user.password,
        email: user.email,
      });
      console.log(response);
      if (response.data.status) {
        toast.success(`SignUp success, Please verify your email`);
        setLoader(false);
      } else {
        toast.error(`SignUp Failed: ${response.data.message}`);
        setLoader(false);
      }
    } catch (error: any) {
      setLoader(false);
      console.error(error.response.data);
      toast.error(
        `Something went wrong: ${error.response.data.message || error.message}`
      );
      
    }
    setIsSignUpDisabled(false);
  };

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="border-3 border-[#9556C8] w-[20rem] h-[23rem] rounded-lg text-[#ECE0F5] p-6">
          <h1 className="py-2 text-2xl text-center font-bold">Sign Up !</h1>
          <label className="mb-2" htmlFor="username">
            Username:
          </label>
          <br />
          <input
            className="bg-[#C5A3E1] mb-2 rounded w-full focus:outline-none focus:outline-[#A874D2] text-black pl-2 font-semibold"
            type="text"
            placeholder="One"
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
          <br />
          <label className="mb-2" htmlFor="email">
            Email:
          </label>
          <br />
          <input
            className="bg-[#C5A3E1] mb-2 rounded w-full focus:outline-none focus:outline-[#A874D2] text-black pl-2 font-semibold"
            type="text"
            placeholder="one@gmail.com"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <br />
          <label className="mb-2" htmlFor="password">
            Password:
          </label>
          <br />
          <input
            className="bg-[#C5A3E1] mb-2 rounded w-full focus:outline-none focus:outline-[#A874D2] text-black pl-2 font-semibold"
            type="password"
            placeholder="type your password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <br />

          {fillOptions && (
            <div className="text-[red] mt-2 font-semibold">
              Please fill all options
            </div>
          )}

          <div className="flex justify-evenly w-full mt-5">
            {!loader && (
              <button
                className={clsx(
                  "bg-[#C5A3E1] py-1 px-2 text-black font-semibold hover:cursor-pointer rounded-lg active:bg-[#9556C8] outline-none ",
                  isSignUpDisabled &&
                    "bg-gray-400 text-white cursor-not-allowed opacity-50 pointer-events-none"
                )}
                disabled={isSignUpDisabled}
                onClick={handleSignUp}
              >
                Signup
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

            <br />
            <Link href={"/login"}>
              <button className="bg-[#C5A3E1] py-1 px-2 text-black font-semibold hover:cursor-pointer rounded-lg active:bg-[#9556C8] outline-none ">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
