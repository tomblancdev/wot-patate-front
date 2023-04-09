"use client";

import React from "react";

export default function Register() {
  return (
    <div>
      <h1>Register</h1>
      <form action="localhost:8000/register" method="post">
        <input type="email" />
        <input type="password" />
        <input type="password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
