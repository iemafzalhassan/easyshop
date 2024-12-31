import ProfileForm from "@/components/forms/ProfileForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "EasyShop is the user-friendly Next.js eCommerce template perfect for launching your online store. With its clean design and customizable options, EasyShop makes selling online a breeze. Start building your dream store today and boost your online presence effortlessly!",
};

const ProfilePage = () => {
  return (
    <section className="profile-page">
      <ProfileForm />
    </section>
  );
};

export default ProfilePage;
