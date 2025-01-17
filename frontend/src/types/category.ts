export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories: Subcategory[];
}
