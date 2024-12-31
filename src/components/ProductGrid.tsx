import fetchData from "@/lib/fetchDataFromApi";
import layoutSettings from "@/lib/layoutSettings";
import NoProductFound from "./NoProductFound";
import Paginations from "./Paginations";
import ProductCard from "./cards/ProductCard";

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

    const res = await fetchData.get(filterString, queryParams);
    const totalCount = res.data?.total;
    const products: BakeryProduct[] = (res.data.products as BakeryProduct[]) || [];
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
    console.error("Error fetching data:", error);
    return <div>Error loading products</div>;
  }
};

export default ProductGrid;
