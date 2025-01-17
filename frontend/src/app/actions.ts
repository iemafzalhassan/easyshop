"use server";

import { cookies } from "next/headers";

export async function authenticated() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  return !!token;
}

export async function deleteCookies(name: string) {
  const cookieStore = cookies();
  cookieStore.delete(name);
}

export async function login(credentials: { email: string; password: string }) {
  try {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function register(userData: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const response = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function getProfile() {
  try {
    const response = await fetch("/api/v1/auth/profile", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Profile fetch error:", error);
    throw error;
  }
}
