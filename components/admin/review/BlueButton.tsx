import React from "react";

export function BlueButton({
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`h-8 rounded bg-sky-800 px-3 text-sm font-semibold text-white hover:bg-sky-900 disabled:opacity-50 ${className}`}
      {...rest}
    />
  );
}
