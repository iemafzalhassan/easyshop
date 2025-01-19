const mongoose = require('mongoose');
const Product = require('../api/v1/models/product.model');
require('dotenv').config();

const updateImagePaths = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} total products`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      try {
        const category = product.shopCategory?.toLowerCase() || product.category?.toLowerCase() || 'gadgets';
        let wasUpdated = false;

        // Update imageUrl path
        if (product.imageUrl) {
          const pathParts = product.imageUrl.split('/');
          const filename = pathParts[pathParts.length - 1];
          const newPath = `/assets/images/products/${category}/${filename}`;
          
          if (product.imageUrl !== newPath) {
            product.imageUrl = newPath;
            wasUpdated = true;
            console.log(`Updating ${product.name}: ${newPath}`);
          }
        }

        // Update image array paths
        if (Array.isArray(product.image)) {
          product.image = [];
          wasUpdated = true;
        }

        if (wasUpdated) {
          await Product.updateOne(
            { _id: product._id },
            { 
              $set: {
                imageUrl: product.imageUrl,
                image: product.image
              }
            }
          );
          updated++;
        } else {
          skipped++;
        }
      } catch (error) {
        console.error(`Error updating product ${product.name}:`, error.message);
        skipped++;
      }
    }

    console.log(`\nUpdate complete. Updated: ${updated}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating products:', error);
    process.exit(1);
  }
};

updateImagePaths();
