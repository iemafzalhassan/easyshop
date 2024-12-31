import fetchData from "@/lib/fetchDataFromApi";
import Link from "next/link";
import { Suspense } from "react";
import FeaturedNav from "./FeaturedNav";
import ProductCard from "./cards/ProductCard";
import Skeleton from "./loader/Skeleton";

type FeaturedParams = {
  featured?: string;
};

const FeaturedGrid = async ({ featured }: FeaturedParams) => {
  try {
    const res = await fetchData.get(`/products/${featured || "gadgets"}`, {
      limit: "8",
    });

    const products = (res.data.products as AllProduct[]) || [];

    return (
      <div className="grid gap-4 grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} variants="style-2" />
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="h-[40vh] flex justify-center items-center text-3xl font-semibold text-center">
        Failed to fetch!
      </div>
    );
  }
};

const FeaturedProducts = async ({ featured }: { featured?: string }) => {
  try {
    const res = await fetchData.get("/products/featured");
    const activeShop = featured || "gadgets";
    return (
      <section className="featured-products py-10 w-full">
        <div className="container">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-5">
            Best sellers in{" "}
            <Link
              href={`/shops/${activeShop}`}
              className="text-primary hover:underline"
            >
              {activeShop}
            </Link>{" "}
            products
          </h1>
          <FeaturedNav />
          <Suspense
            key={featured}
            fallback={
              <div className="grid gap-4 grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6">
                {[...Array(8)].map((_, index) => (
                  <div
                    className="p-2.5 md:p-4 rounded-lg bg-secondary"
                    key={index}
                  >
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-4 w-4/5 rounded-3xl mt-3" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-16 rounded-3xl mt-3" />
                      <Skeleton className="h-7 w-20 rounded-3xl mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <FeaturedGrid featured={featured} />
          </Suspense>

          <div className="mt-7 flex justify-center w-full">
            <Link
              type="button"
              href={`/shops/${activeShop}`}
              className="py-3 px-4 rounded-lg border bg-primary uppercase font-medium hover:bg-transparent border-primary transition-all duration-150"
            >
              View More
            </Link>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error:", error);
    return <div>Error loading featured products</div>;
  }
};

export default FeaturedProducts;
