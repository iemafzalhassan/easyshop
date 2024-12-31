"use server";

import { cookies } from 'next/headers';

export async function createCookies(data: string) {
  const cookieStore = cookies();
  await cookieStore.set("token", data);
}

export async function deleteCookies(name: string) {
  const cookieStore = cookies();
  await cookieStore.delete(name);
}

export async function getCookies(name: string) {
  const cookieStore = cookies();
  const cookie = await cookieStore.get(name);
  return cookie;
}

export async function authenticated() {
  const token = await getCookies("token");
  return !!token;
}
