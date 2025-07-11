"use client";

import axios from "axios";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({ username: "", password: "" });
  const [fillOptions, setFillOptions] = useState(false);
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);
  const [loader, setLoader] = useState(false);

  const firstTime = useRef(false);

  useEffect(() => {
    if (firstTime.current) {
      if (!user.username || !user.password) {
        setFillOptions(true);
        setIsLoginDisabled(true);
      } else {
        setIsLoginDisabled(false);
        setFillOptions(false);
      }
    } else {
      firstTime.current = true;
    }
  }, [user]);

  const handleLogin = async () => {
    setIsLoginDisabled(true);
    setLoader(true);

    try {
      const loginResponse = await axios.post(`/api/users/login`, {
        username: user.username,
        email: user.username,
        password: user.password,
      });

      if (loginResponse.data.status) {
        toast.success(`Login success`);
        router.push("/profile");
      } else {
        console.error(loginResponse);
        toast.error(`Login failed: ${loginResponse.data.message}`);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        `Something went wrong: ${error.response.data.message || error.messagge}`
      );
    }
    setIsLoginDisabled(false);
    setLoader(false);
  };

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="border-3 border-[#9556C8] w-[20rem] h-[23rem] rounded-lg text-[#ECE0F5] p-6">
          <h1 className="py-2 text-2xl text-center font-bold">LogIn!</h1>
          <label className="mb-2" htmlFor="username">
            Username/Email:
          </label>
          <br />
          <input
            className="bg-[#C5A3E1] mb-2 rounded w-full focus:outline-none focus:outline-[#A874D2] text-black pl-2 font-semibold"
            type="text"
            placeholder="One/one@gmail.com"
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
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
                  isLoginDisabled &&
                    "bg-gray-400 text-white cursor-not-allowed opacity-50 pointer-events-none"
                )}
                disabled={isLoginDisabled}
                onClick={handleLogin}
              >
                Login
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
            <Link href={"/signup"}>
              <button className="bg-[#C5A3E1] py-1 px-2 text-black font-semibold hover:cursor-pointer rounded-lg active:bg-[#9556C8] outline-none ">
                SignUp
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
