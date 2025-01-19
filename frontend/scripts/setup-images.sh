#!/bin/bash

# Create necessary directories
mkdir -p public/assets/images/products/{bakery,books,clothing,furniture,gadgets,grocery,makeup,medicine,bags}

# Copy default category images if they don't exist
categories=("bakery" "books" "clothing" "furniture" "gadgets" "grocery" "makeup" "medicine" "bags")

for category in "${categories[@]}"; do
  if [ ! -f "public/assets/images/products/$category/${category}1.png" ]; then
    cp "src/assets/images/products/$category/${category}1.png" "public/assets/images/products/$category/" 2>/dev/null || echo "Warning: Default image for $category not found"
  fi
done

echo "Image setup complete!"
