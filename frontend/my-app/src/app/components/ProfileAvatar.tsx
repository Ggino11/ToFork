import React from "react";


interface ProfileAvatarProps {
    userName?: string;
    userLastName?: string;
    size?: number;
}

export default function ProfileAvatar( {
  userName,
  userLastName,
  size = 60,
}: ProfileAvatarProps) {

    const initials = `${userName?.charAt(0) ?? ""}${userLastName?.charAt(0) ?? ""}`;

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-logo font-bold text-white select-none`}
      style={{
        width: size,
        height: size,
        fontSize: size / 2,
      }}
    >
      {initials}
    </div>
  );
}