export const mainNavLinks = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Shops",
    url: "/shops",
  },
  {
    title: "Contact",
    url: "/contact",
  },
];

export const profileNavLinks = [
  {
    title: "Profile",
    url: "/profile",
  },
  {
    title: "Orders",
    url: "/profile/orders",
  },
  {
    title: "Wishlist",
    url: "/profile/wishlist",
  },
];

export const shopCategories = [
  { title: "gadgets", icon: "/assets/icons/gadgets.png" },
  { title: "grocery", icon: "/assets/icons/grocery.png" },
  { title: "bakery", icon: "/assets/icons/bakery.png" },
  { title: "clothing", icon: "/assets/icons/clothing.png" },
  { title: "makeup", icon: "/assets/icons/makeup.png" },
  { title: "books", icon: "/assets/icons/books.png" },
  { title: "bags", icon: "/assets/icons/bag.png" },
  { title: "furniture", icon: "/assets/icons/furniture.png" },
  { title: "medicine", icon: "/assets/icons/medicine.png" },
];

// Export categories for backward compatibility
export const categories = shopCategories;

// Export shop names type
export type ShopNames = typeof shopCategories[number]["title"];
