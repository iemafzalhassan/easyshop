"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    const cookieStore = cookies();
    
    cookieStore.set('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    return data;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function getProfile() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    
    if (!token) {
      return null;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/v1/auth/profile`, {
      headers: {
        "Authorization": `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get profile');
    }

    return response.json();
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
}
