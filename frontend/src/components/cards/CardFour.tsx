import Image from "next/image";
import Link from "next/link";
import AddToCartBtnWrapper from "../AddToCartWrapper";
import { discountPercent } from "../../lib/utils";
import { AllProduct } from "../../types/product";

const CardFour = ({
  _id,
  title,
  image,
  price,
  oldPrice,
  unit_of_measure,
  shop_category,
}: AllProduct) => {
  // Use the first image from the array or a default based on shop category
  const getImagePath = (productType: string, category: string) => {
    // Handle bakery products
    if (category === 'bakery') {
      if (productType.includes('cake')) return '/assets/images/products/bakery/cake.png';
      if (productType.includes('coffee')) return '/assets/images/products/bakery/coffee.png';
      if (productType.includes('cookie')) return '/assets/images/products/bakery/cookies.png';
      if (productType.includes('danish')) return '/assets/images/products/bakery/danish.png';
      if (productType.includes('pie')) return '/assets/images/products/bakery/feeterpies.png';
      if (productType.includes('juice')) return '/assets/images/products/bakery/juice.png';
      if (productType.includes('pita')) return '/assets/images/products/bakery/pitabread.png';
      if (productType.includes('bread')) return '/assets/images/products/bakery/softbread.png';
      if (productType.includes('toast')) return '/assets/images/products/bakery/toast.png';

      // Random bakery image
      const num = Math.floor(Math.random() * 57) + 1;
      return `/assets/images/products/bakery/bakery${num}.png`;
    }

    // Handle books
    if (category === 'books') {
      const availableBookNumbers = Array.from({ length: 20 }, (_, i) => i + 1);
      const randomIndex = Math.floor(Math.random() * availableBookNumbers.length);
      return `/assets/images/products/books/book${availableBookNumbers[randomIndex]}.png`;
    }

    // Handle gadgets
    if (category === 'gadgets') {
      if (productType.includes('phone')) return '/assets/images/products/gadgets/phone.png';
      if (productType.includes('laptop')) return '/assets/images/products/gadgets/laptop.png';
      if (productType.includes('tablet')) return '/assets/images/products/gadgets/tablet.png';
      if (productType.includes('watch')) return '/assets/images/products/gadgets/watch.png';

      const num = Math.floor(Math.random() * 20) + 1;
      return `/assets/images/products/gadgets/gadget${num}.png`;
    }

    // Handle furniture
    if (category === 'furniture') {
      if (productType.includes('chair')) return '/assets/images/products/furniture/chair.png';
      if (productType.includes('table')) return '/assets/images/products/furniture/table.png';
      if (productType.includes('sofa')) return '/assets/images/products/furniture/sofa.png';
      if (productType.includes('bed')) return '/assets/images/products/furniture/bed.png';

      const num = Math.floor(Math.random() * 15) + 1;
      return `/assets/images/products/furniture/furniture${num}.png`;
    }

    // Default case: use numbered product images
    const num = Math.floor(Math.random() * 10) + 1;
    return `/assets/images/products/${category}/product${num}.png`;
  };

  // If image is provided in the product data, use it, otherwise use default
  const imagePath = image?.[0] ? image[0].startsWith('/') ? image[0] : `/${image[0]}` : getImagePath(title?.toLowerCase() || '', shop_category?.toLowerCase() || 'bakery');
  
  return (
    <div className="clothing-card bg-secondary p-3 md:p-4 rounded-lg relative hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      {/* discount */}
      {oldPrice && (
        <p className="discount absolute top-3 right-3 sm:top-5 sm:right-5 text-xs px-2 py-1 rounded-md bg-green-600 text-white">
          -{discountPercent(price, oldPrice)}
        </p>
      )}
      <Link href={`/products/${_id}`}>
        <div className="img rounded-sm overflow-hidden">
          <Image
            src={imagePath}
            width={500}
            height={500}
            alt={title}
            className="bg-accent"
            priority
          />

          <div className="content mt-2 font-semibold">
            <h2
              className="line-clamp-1 text-gray-700 dark:text-gray-300"
              title={title}
            >
              {title}
            </h2>
          </div>
        </div>
      </Link>
      <div className="flex justify-between items-center mt-2 gap-2 flex-wrap">
        <p className="flex gap-2 items-end">
          <span className="">${price.toFixed(2)}</span>
          {oldPrice && (
            <del className="text-sm text-gray-400">${oldPrice.toFixed(2)}</del>
          )}
        </p>
        <AddToCartBtnWrapper
          btnStyle="style-4"
          cartItem={{
            _id,
            name: title,
            image: imagePath,
            price,
            quantity: 1
          }}
        />
      </div>
    </div>
  );
};

export default CardFour;
