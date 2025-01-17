import { FilterOptions } from "@/components/filters/FilterNav";
import { ProductCardVariants } from "@/components/cards/ProductCard";

// here you can change heroImages, filterOptions and productCard variants for specific shop

interface HeroImage {
  bgImg: string;
}

interface Hero {
  images: HeroImage[];
}

interface Category {
  hero: Hero;
  filterOptions?: FilterOptions;
  productCardVariants?: ProductCardVariants;
}

interface Data {
  [key: string]: Category;
}

const layoutSettings: Data = {
  // bags
  bags: {
    hero: {
      images: [
        {
          bgImg: "/assets/images/hero/clothing1.png",
        },
        {
          bgImg: "/assets/images/hero/clothing2.png",
        },
        {
          bgImg: "/assets/images/hero/clothing3.png",
        },
      ],
    },

    productCardVariants: "style-1",
  },

  //   bakery
  bakery: {
    hero: {
      images: [
        {
          bgImg: "/assets/images/hero/bakery1.png",
        },
        {
          bgImg: "/assets/images/hero/bakery2.png",
        },
      ],
    },
  },

  //   books
  books: {
    hero: {
      images: [
        {
          bgImg: "/assets/images/hero/book1.png",
        },
      ],
    },
    productCardVariants: "book-card",
  },

  //   clothing
  clothing: {
    hero: {
      images: [
        {
          bgImg: "/assets/images/hero/clothing1.png",
        },
        {
          bgImg: "/assets/images/hero/clothing2.png",
        },
        {
          bgImg: "/assets/images/hero/clothing3.png",
        },
      ],
    },
    filterOptions: {
      useColor: true,
      usePrice: true,
    },
  },

  //   furniture
  furniture: {
    hero: {
      images: [
        {
          bgImg: "/assets/images/hero/furniture1.png",
        },
      ],
    },
  },

  //   gadgets
  gadgets: {
    hero: {
      images: [
        {
          bgImg: "/assets/images/hero/gadget1.png",
        },
        {
          bgImg: "/assets/images/hero/gadget2.png",
        },
        {
          bgImg: "/assets/images/hero/gadget3.png",
        },
      ],
    },

    filterOptions: {
      useColor: true,
      usePrice: true,
    },

    productCardVariants: "style-1",
  },

  //   grocery
  grocery: {
    hero: {
      images: [
        {
          bgImg: "/assets/images/hero/grocery.png",
        },
      ],
    },
    productCardVariants: "style-2",
  },

  //   makeup
  makeup: {
    hero: {
      images: [
        {
          bgImg: "/assets/images/hero/makeup1.png",
        },
        {
          bgImg: "/assets/images/hero/makeup2.png",
        },
      ],
    },
    productCardVariants: "style-3",
  },

  //   medicine
  medicine: {
    hero: {
      images: [
        {
          bgImg: "/assets/images/hero/medicine.png",
        },
      ],
    },
  },
};

export default layoutSettings;
