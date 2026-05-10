"use client";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import { GoogleLogin } from "@react-oauth/google";
import { X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { useAuthGoogle } from "../hooks/use-auth-google";

interface Props {
  onClose?: () => void;
}

export default function Login({ onClose }: Props): React.ReactNode {
  const [email, setEmail] = useState<string>("");

  const authGoogle = useAuthGoogle();

  return (
    <div className="w-full max-w-lg bg-white h-full md:h-fit md:rounded-b-3xl  mt-10 rounded-t-3xl py-3 px-5 flex-col">
      <div className="w-full flex justify-end">
        <Button variant="ghost" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>
      <div className="py-10">
        <div className="flex w-full flex-col items-center mb-3 gap-3">
          <Image
            width={100}
            height={100}
            src="/logo.png"
            alt="dieng.id"
            className="w-10"
          />
          <h1 className="text-2xl font-medium">Masuk atau daftar</h1>
        </div>
        <div className="mt-7 space-y-3">
          <Input label="Email anda" value={email} />
          <p className="text-xs text-gray-400 font-light">
            Kami akan mengirimkan konfirmasi melalui email.
          </p>
          <Button className="w-full">Masuk</Button>
        </div>
        <div className="flex justify-center items-center flex-col mt-6">
          <div className="bg-gray-300 h-[0.4px] w-full"></div>
          <span className="text-xs text-gray-400 p-2 bg-white absolute">
            atau
          </span>
        </div>
        <div className="mt-6 ">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              console.log(credentialResponse.credential);
              authGoogle.mutate({ token: credentialResponse.credential ?? "" });
            }}
            onError={() => console.log("Login Failed")}
          />
        </div>
      </div>
    </div>
  );
}
