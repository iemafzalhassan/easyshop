const { migrateProducts } = require('../database/migrations/productMigration');

console.log('Starting product migration...');

migrateProducts()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
