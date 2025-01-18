import Image from "next/image";
import Link from "next/link";

const gadgets = [
  {
    title: "Smart phones",
    img: "/assets/images/categories/smartphones.jpg",
    link: "/shops/gadgets/mobiles",
  },
  {
    title: "Camera",
    img: "/assets/images/categories/camera.png",
    link: "/shops/gadgets/cameras",
  },
  {
    title: "Laptops",
    img: "/assets/images/categories/laptop.jpg",
    link: "/shops/gadgets/laptops",
  },
  {
    title: "Headphones",
    img: "/assets/images/categories/headphone.png",
    link: "/shops/gadgets/headphones",
  },
  {
    title: "TV",
    img: "/assets/images/categories/tv.jpg",
    link: "/shops/gadgets/TVs",
  },
  {
    title: "Laptops",
    img: "/assets/images/products/gadgets/macbookair2019.png",
    link: "/shops/gadgets/laptops",
  },
];

const clothing = [
  {
    title: "Hoodies",
    img: "/assets/images/categories/hoodies.jpg",
    link: "/shops/clothing/hoodie",
  },
  {
    title: "Tops",
    img: "/assets/images/categories/tops.jpg",
    link: "/shops/clothing/tops",
  },
  {
    title: "Dresses",
    img: "/assets/images/products/clothing/dress1.png",
    link: "/shops/clothing/dresses",
  },
  {
    title: "Blazers",
    img: "/assets/images/products/clothing/blazer1.png",
    link: "/shops/clothing/blazers",
  },
  {
    title: "Coats",
    img: "/assets/images/products/clothing/coat1.png",
    link: "/shops/clothing/coats",
  },
  {
    title: "Pants",
    img: "/assets/images/products/clothing/pant1.png",
    link: "/shops/clothing/pants",
  },
  {
    title: "Skirts",
    img: "/assets/images/products/clothing/skirt1.png",
    link: "/shops/clothing/skirts",
  },
];

const beauty = [
  {
    title: "Makeups",
    img: "/assets/images/categories/makeups.jpg",
    link: "/shops/makeup",
  },
  {
    title: "Lipsticks",
    img: "/assets/images/categories/lipsticks.jpg",
    link: "/shops/makeup/lip-stick",
  },
  {
    title: "Mascaras",
    img: "/assets/images/categories/mascaras.jpg",
    link: "/shops/makeup/mascara",
  },
  {
    title: "Facewashes",
    img: "/assets/images/categories/facewashes.jpg",
    link: "/shops/makeup/facial-care",
  },
  {
    title: "beautycare",
    img: "/assets/images/categories/beautycare.png",
    link: "/shops/makeup/beautycare",
  },
  {
    title: "Lipsticks",
    img: "/assets/images/products/makeup/makeup9.png",
    link: "/shops/makeup/lipstick",
  },
];

const furnitures = [
  {
    title: "Furnitures",
    img: "/assets/images/categories/furnitures.png",
    link: "/shops/furniture",
  },
  {
    title: "Table",
    img: "/assets/images/categories/tables.png",
    link: "/shops/furniture/tables",
  },
  {
    title: "Sofa",
    img: "/assets/images/categories/sofa.png",
    link: "/shops/furniture/sofa",
  },
  {
    title: "Chair",
    img: "/assets/images/categories/chair.png",
    link: "/shops/furniture/chairs",
  },
];

const groceries = [
  {
    title: "Fruits & Vegetables",
    img: "/assets/images/categories/fruites&vagetables.png",
    link: "/shops/grocery/fruits-and-vegetables",
  },
  {
    title: "Dairy",
    img: "/assets/images/categories/dairy.jpg",
    link: "/shops/grocery/dairy",
  },
  {
    title: "Snacks",
    img: "/assets/images/categories/snacks.png",
    link: "/shops/grocery/snacks",
  },
  {
    title: "Meat & Fish",
    img: "/assets/images/categories/meat&fish.jpg",
    link: "/shops/grocery/meat-and-fish",
  },
];

const medicines = [
  {
    title: "Medicines",
    img: "/assets/images/categories/health.jpg",
    link: "/shops/medicine",
  },
  {
    title: "Beauty Care",
    img: "/assets/images/categories/beautycare.png",
    link: "/shops/medicine/beauty-care",
  },
  {
    title: "Baby Care",
    img: "/assets/images/categories/babycare.png",
    link: "/shops/medicine/baby-care",
  },
  {
    title: "First Aid",
    img: "/assets/images/categories/firstaid.jpg",
    link: "/shops/medicine/first-aid",
  },
];

const ShopCategories = () => {
  return (
    <section className="shop-categories relative z-10">
      <div className="container mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 min-[991px]:grid-cols-3 gap-5">
          {/* gadgets */}
          <div className="gadgets bg-secondary p-4 rounded-lg shadow-lg flex flex-col justify-between gap-y-2">
            <div>
              <h2 className="capitalize font-semibold text-2xl">
                Easy Shop <span className="text-primary">Gadget</span> Store
              </h2>
              <div className="grid grid-cols-2 gap-5 mt-5">
                {gadgets.map((item, index) => (
                  <Link
                    href={item.link}
                    key={index}
                    className="hover:text-primary transition-all duration-300"
                  >
                    <div className="aspect-square border rounded-lg overflow-hidden">
                      <Image
                        src={item.img}
                        width={200}
                        height={200}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="capitalize text-lg mt-1">{item.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <Link
                className="hover:underline text-primary"
                href={"/shops/gadgets"}
              >
                Explore More
              </Link>
            </div>
          </div>
          {/* clothing */}
          <div className="clothing bg-secondary p-4 rounded-lg shadow-lg flex flex-col justify-between gap-y-2">
            <div>
              <h2 className="capitalize font-semibold text-2xl">
                <span className="text-primary">Fashion</span> trends you like
              </h2>
              <div className="grid grid-cols-3 gap-x-3 gap-y-2 mt-5">
                {clothing.map((item, index) => (
                  <Link
                    href={item.link}
                    key={index}
                    className="first:col-span-3 [&>div]:first:aspect-[3/2] hover:text-primary transition-all duration-300"
                  >
                    <div className="aspect-square border rounded-lg overflow-hidden">
                      <Image
                        src={item.img}
                        width={200}
                        height={200}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="capitalize text-lg mt-1">{item.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <Link
                className="hover:underline text-primary"
                href={"/shops/clothing"}
              >
                See More
              </Link>
            </div>
          </div>
          {/* beauty products */}
          <div className="beauty bg-secondary p-4 rounded-lg shadow-lg flex flex-col justify-between gap-y-2">
            <div>
              <h2 className="capitalize font-semibold text-2xl">
                <span className="text-primary">Beauty</span> Products
              </h2>
              <div className="grid grid-cols-2 gap-5 mt-5 h-fit">
                {beauty.map((item, index) => (
                  <Link
                    href={item.link}
                    key={index}
                    className="hover:text-primary transition-all duration-300"
                  >
                    <div className="aspect-square border rounded-lg overflow-hidden">
                      <Image
                        src={item.img}
                        width={200}
                        height={200}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="capitalize text-lg mt-1">{item.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <Link
                className="hover:underline text-primary"
                href={"/shops/makeup"}
              >
                Explore More
              </Link>
            </div>
          </div>

          {/* groceries products */}
          <div className="groceries bg-secondary p-4 rounded-lg shadow-lg flex flex-col justify-between gap-y-2">
            <div>
              <h2 className="capitalize font-semibold text-2xl">
                Fresh groceries
              </h2>
              <div className="grid grid-cols-2 gap-5 mt-5">
                {groceries.map((item, index) => (
                  <Link
                    href={item.link}
                    key={index}
                    className="hover:text-primary"
                  >
                    <div className="aspect-square border rounded-lg overflow-hidden">
                      <Image
                        src={item.img}
                        width={200}
                        height={200}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="capitalize text-lg mt-1 transition-colors duration-300">
                      {item.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <Link
                className="hover:underline text-primary"
                href={"shops/grocery"}
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Furnitures products */}
          <div className="furnitures bg-secondary p-4 rounded-lg shadow-lg flex flex-col justify-between gap-y-2">
            <div>
              <h2 className="capitalize font-semibold text-2xl">
                Exclusive Furnitures
              </h2>
              <div className="grid grid-cols-3 gap-x-3 gap-y-2 mt-5">
                {furnitures.map((item, index) => (
                  <Link
                    href={item.link}
                    key={index}
                    className="first:col-span-3 [&>div]:first:aspect-[3/2] hover:text-primary transition-all duration-300"
                  >
                    <div className="aspect-square border rounded-lg overflow-hidden">
                      <Image
                        src={item.img}
                        width={200}
                        height={200}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="capitalize text-lg mt-1">{item.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <Link
                className="hover:underline text-primary"
                href={"/shops/furniture"}
              >
                Get More
              </Link>
            </div>
          </div>

          {/* Health products */}
          <div className="Health bg-secondary p-4 rounded-lg shadow-lg flex flex-col justify-between gap-y-2">
            <div>
              <h2 className="capitalize font-semibold text-2xl">
                Your health partner
              </h2>
              <div className="grid grid-cols-2 gap-5 mt-5">
                {medicines.map((item, index) => (
                  <Link
                    href={item.link}
                    key={index}
                    className="hover:text-primary transition-all duration-300"
                  >
                    <div className="aspect-square border rounded-lg overflow-hidden">
                      <Image
                        src={item.img}
                        width={200}
                        height={200}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="capitalize text-lg mt-1">{item.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <Link
                className="hover:underline text-primary"
                href={"/shops/medicine"}
              >
                Explore More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopCategories;
