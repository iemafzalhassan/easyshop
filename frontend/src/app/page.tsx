import BannerSlider from "../components/BannerSlider";
import BekaryCategories from "../components/BekaryCategories";
import BooksCategory from "../components/BooksCategory";
import FeaturedProducts from "@/components/FeaturedProducts";
import ShopCategories from "../components/ShopCategories";
import HeroSlider from "../components/heros/HeroSlider";

const heroImages = [
  {
    bgImg: "/assets/images/hero/clothing1.png",
  },
  {
    bgImg: "/assets/images/hero/gadget1.png",
  },
  {
    bgImg: "/assets/images/hero/makeup2.png",
  },
  {
    bgImg: "/assets/images/hero/furniture1.png",
  },
  {
    bgImg: "/assets/images/hero/clothing2.png",
  },
  {
    bgImg: "/assets/images/hero/book1.png",
  },
  {
    bgImg: "/assets/images/hero/clothing3.png",
  },
  {
    bgImg: "/assets/images/hero/grocery.png",
  },
];

const bannerImages = [
  {
    img: "/assets/images/banners/banner1.png",
  },
  {
    img: "/assets/images/banners/banner2.png",
  },
  {
    img: "/assets/images/banners/banner3.png",
  },
  {
    img: "/assets/images/banners/banner4.png",
  },
  {
    img: "/assets/images/banners/banner5.png",
  },
];

export default function Home({
  searchParams,
}: {
  searchParams: {
    featured: string;
  };
}) {
  return (
    <>
      <HeroSlider heroImages={heroImages} />
      <BannerSlider bannerImages={bannerImages} />
      <ShopCategories />
      <BooksCategory />
      <BekaryCategories />
      <FeaturedProducts featured={searchParams.featured} />
    </>
  );
}
