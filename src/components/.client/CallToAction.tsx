"use client";

import React from "react";

interface CallToActionProps extends React.HTMLAttributes<HTMLButtonElement> {}

export default function CallToAction({
  children,
  ...props
}: CallToActionProps) {
  return <button {...props}>{children}</button>;
}
