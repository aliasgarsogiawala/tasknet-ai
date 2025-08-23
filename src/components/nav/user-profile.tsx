'use client';
import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function UserProfile() {
    const session = useSession();

    const imageUrl = session.data?.user?.image || "";
    const email = session.data?.user?.email || "User";
    const name = session.data?.user?.name || "User";
    
    return (
        <div className="flex items-center justify-start gap-1 lg:gap-2 
        m-0 p-0 lg:px-3 lg:w-full bg-white">
            {imageUrl && (
            <Image 
            src={session.data?.user?.image || ""} 
            width={24} 
            height={24} 
            alt={`${name} User Profile Picture`} 
            className='rounded-full' 
            />
            )}
            <p className="truncate">{email}</p>
        </div>
    );
}
