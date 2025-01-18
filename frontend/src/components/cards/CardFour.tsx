import Image from "next/image";
import Link from "next/link";
import AddToCartWrapper from "@/components/AddToCartWrapper";
import { discountPercent } from "../../lib/utils";
import { AllProduct } from "../../types/product";
import { cn } from "@/lib/utils";

const CardFour = ({
  _id,
  title,
  image,
  price,
  oldPrice,
  unit_of_measure,
  shop_category,
}: AllProduct) => {
  const displayImage = Array.isArray(image) ? image[0] : image;
  const imagePath = displayImage?.startsWith('/') ? displayImage : `/${displayImage}`;

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all duration-300 hover:shadow-lg">
      <Link href={`/products/${_id}`} className="block">
        {/* Discount Badge */}
        {oldPrice && oldPrice > price && (
          <div className="absolute left-2 top-2 z-10 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
            {discountPercent(price, oldPrice)}% Off
          </div>
        )}

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted/10">
          <Image
            src={imagePath}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-2 p-4">
          {/* Title */}
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-foreground group-hover:text-primary">
            {title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary">
              ${price.toFixed(2)}
            </span>
            {oldPrice && oldPrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                ${oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Unit */}
          {unit_of_measure && (
            <p className="text-xs text-muted-foreground">
              Per {unit_of_measure}
            </p>
          )}
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-background/80 p-4 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
        <AddToCartWrapper
          product={{
            _id,
            title,
            image: imagePath,
            price,
            oldPrice,
            unit_of_measure,
            shop_category,
          }}
          btnStyle="full-width"
        />
      </div>
    </div>
  );
};

export default CardFour;
