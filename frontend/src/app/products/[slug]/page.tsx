import { Metadata, ResolvingMetadata } from "next";
import ProductPageContent from "@/components/ProductPageContent";
import { api } from "@/services/api";
import { SingleProductType } from "@/types/product";

type SingleProductPageProps = {
  params: {
    id: string;
    slug: string;
  };
};

export async function generateMetadata(
  { params }: SingleProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { id, slug } = params;
    const res = await api.get(`/products/${id || slug}`);
    const product: SingleProductType | null = res.data.data.product || null;

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The product you are looking for does not exist",
      };
    }

    const previousImages = (await parent).openGraph?.images || [];
    const productImage = Array.isArray(product.image) ? product.image[0] : product.image;

    return {
      title: product.title || product.name,
      description: product.description || "Product details",
      openGraph: {
        title: product.title || product.name,
        description: product.description || "Product details",
        images: productImage ? [productImage, ...previousImages] : previousImages,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product Not Found",
      description: "Unable to load product details",
    };
  }
}

export default function SingleProductPage({ params: { id, slug } }: SingleProductPageProps) {
  return <ProductPageContent id={id} slug={slug} />;
}
