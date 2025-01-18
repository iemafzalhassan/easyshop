export interface AllProduct {
  _id: string;
  title: string;
  image: string;
  price: number;
  oldPrice?: number;
  unit_of_measure: string;
  shop_category: string;
}
