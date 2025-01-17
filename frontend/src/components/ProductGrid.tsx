import { api } from "@/services/api";
import NoProductFound from "@/components/NoProductFound";
import Paginations from "@/components/Paginations";
import ProductCard from "@/components/cards/ProductCard";

type CategoryPageProps = {
  searchParams: SearchParamsType;
  params: {
    category: string;
    shop: string;
  };
};

const ProductGrid = async ({ params, searchParams }: CategoryPageProps) => {
  try {
    const { shop, category } = params;
    
    const filterString = category
      ? `/products/${shop}/${category}`
      : `/products/${shop}`;

    const queryParams = {
      page: searchParams?.page || "1",
      q: searchParams?.q || "",
      sort: searchParams?.sort || "",
      order: searchParams?.order || "",
      color: searchParams?.color || "",
      minPrice: searchParams?.minPrice || "",
      maxPrice: searchParams?.maxPrice || "",
    };

    const fetchProducts = async () => {
      try {
        const response = await api.get(filterString, { params: queryParams });
        const totalCount = response.data?.total;
        const products: BakeryProduct[] = (response.data.products as BakeryProduct[]) || [];
        const settings = layoutSettings?.[shop];

        if (products.length === 0) {
          return <NoProductFound />;
        }

        return (
          <>
            <div className="grid-layout pt-6">
              {products.map((product) => (
                <ProductCard
                  product={product}
                  variants={settings.productCardVariants}
                  key={product._id}
                />
              ))}
            </div>
            <Paginations totalCount={totalCount} />
          </>
        );
      } catch (error) {
        console.error("Error fetching products:", error);
        return <div>Error loading products</div>;
      }
    };

    return fetchProducts();
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading products</div>;
  }
};

export default ProductGrid;
