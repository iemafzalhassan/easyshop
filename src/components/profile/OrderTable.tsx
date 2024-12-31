import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CartItem } from "@/lib/features/cart/cartSlice";
import Image from "next/image";
import Link from "next/link";

type OrderTableProps = {
  products: CartItem[];
};

export function OrderTable({ products }: OrderTableProps) {
  return (
    <Table className="mt-5 table-auto">
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader className="bg-accent w-full">
        <TableRow className="w-full">
          <TableHead>Item</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((item) => (
          <TableRow key={item._id}>
            <TableCell className="font-medium">
              <div className="flex gap-3">
                <Image
                  src={item.image}
                  width={40}
                  height={40}
                  alt={item.title}
                  className="rounded-lg"
                />
                <div>
                  <Link
                    href={`/products/${item._id}`}
                    className="hover:text-primary hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-primary mt-1">
                    <span>${item.price}</span>
                    <span className="text-[9px] align-top text-muted-foreground ml-1">
                      {item.unit_of_measure}
                    </span>
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center">{item?.amount}</TableCell>
            <TableCell className="text-right">{item.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
