const fs = require('fs').promises;
const path = require('path');
const { Product } = require('../../models/product.model');
const { connectDB } = require('../../config/database');

async function loadProductData() {
  try {
    const dbPath = path.join(process.cwd(), '..', '.db', 'db.json');
    const data = await fs.readFile(dbPath, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData.products;
  } catch (error) {
    console.error('Error loading product data:', error);
    throw error;
  }
}

async function processImagePaths(images, category) {
  if (!Array.isArray(images)) return [];
  
  return images.map(image => {
    // If image path starts with /, remove it
    const cleanPath = image.startsWith('/') ? image.substring(1) : image;
    
    // If image path doesn't include the category, add it
    if (!cleanPath.includes(category.toLowerCase())) {
      return `assets/images/products/${category.toLowerCase()}/${path.basename(cleanPath)}`;
    }
    
    return cleanPath;
  });
}

async function migrateProducts() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Load product data from db.json
    const products = await loadProductData();
    
    // Counter for tracking progress
    let processed = 0;
    let errors = [];
    
    console.log(`Starting migration of ${products.length} products...`);
    
    for (const product of products) {
      try {
        // Convert the product data to match our schema
        const processedImages = await processImagePaths(product.image, product.shop_category);
        
        const productData = {
          title: product.title,
          description: product.description,
          price: product.price,
          oldPrice: product.oldPrice,
          categories: product.categories || [product.shop_category],
          image: processedImages,
          unit_of_measure: product.unit_of_measure || 'piece',
          quantity: product.amount || 0,
          rating: product.rating || 0,
          shop_category: product.shop_category,
          featured: product.featured || false,
          colors: product.colors || [],
          sizes: product.sizes || [],
        };
        
        // Check if product already exists
        const existingProduct = await Product.findOne({ title: product.title });
        
        if (existingProduct) {
          // Update existing product
          await Product.findByIdAndUpdate(existingProduct._id, productData, {
            new: true,
            runValidators: true,
          });
          console.log(`Updated product: ${product.title}`);
        } else {
          // Create new product
          await Product.create(productData);
          console.log(`Created product: ${product.title}`);
        }
        
        processed++;
        
      } catch (error) {
        errors.push({
          product: product.title,
          error: error.message,
        });
        console.error(`Error processing product ${product.title}:`, error);
      }
    }
    
    console.log('\nMigration Summary:');
    console.log(`Total products processed: ${processed}`);
    console.log(`Successful migrations: ${processed - errors.length}`);
    console.log(`Failed migrations: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\nErrors encountered:');
      errors.forEach(({ product, error }) => {
        console.log(`- ${product}: ${error}`);
      });
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is run directly
if (require.main === module) {
  migrateProducts()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = {
  migrateProducts,
  loadProductData,
  processImagePaths,
};
