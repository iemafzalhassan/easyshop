import Image from "next/image";
import Link from "next/link";
import AddToCartBtnWrapper from "../AddToCartWrapper";
import { discountPercent } from "@/lib/utils";

const CardTwo = ({
  _id,
  title,
  image,
  price,
  unit_of_measure,
  oldPrice,
  shop_category,
}: AllProduct) => {
  return (
    <div className="card-two bg-secondary p-2.5 md:p-4 rounded-lg relative hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <Link
        href={`/products/${_id}`}
        className="absolute top-0 left-0 w-full h-full"
      />
      {/* discount */}
      {oldPrice && (
        <p className="discount absolute top-3 right-3 sm:top-5 sm:right-5 text-xs px-2 py-1 rounded-md bg-green-600 text-white">
          -{discountPercent(price, oldPrice)}
        </p>
      )}
      <div className="img rounded-sm overflow-hidden">
        <Image
          src={image[0]}
          width={500}
          height={500}
          alt={title}
          className="bg-accent"
        />
      </div>
      <div className="content mt-2 text-sm sm:text-base">
        <h3 className="mb-2 line-clamp-1" title={title}>
          {title}
        </h3>

        {oldPrice && (
          <del className="font-semibold text-xs text-gray-700 dark:text-gray-300">
            ${oldPrice.toFixed(2)}
          </del>
        )}

        <div className="flex justify-between items-center flex-wrap gap-2">
          <p className="font-semibold">
            <span>${price.toFixed(2)}</span>{" "}
            <span className="text-[10px] align-top text-gray-700 dark:text-gray-300">
              {unit_of_measure}
            </span>
          </p>

          <AddToCartBtnWrapper
            btnStyle="style-2"
            cartItem={{
              _id,
              title,
              image: image[0],
              price,
              unit_of_measure,
              shop_category,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CardTwo;
