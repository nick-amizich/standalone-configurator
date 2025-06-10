# Shopify Product Configurator API

A minimal, standalone Next.js API service for handling product configurations from Shopify. This service provides endpoints to store, retrieve, and manage product configuration data with CORS support for Shopify integration.

## Features

- RESTful API endpoints for product configuration management
- Full CORS support for Shopify integration
- Supabase integration for data persistence
- TypeScript for type safety
- Minimal dependencies for easy deployment
- No authentication complexity - uses Supabase service role

## Prerequisites

- Node.js 18+ 
- Supabase account and project
- Shopify store (for integration)

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   cd standalone-configurator
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. **Set up database:**
   
   Run the migration in your Supabase project:
   - Go to Supabase Dashboard > SQL Editor
   - Copy contents of `supabase/migrations/001_create_product_configurations.sql`
   - Run the SQL

4. **Run development server:**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

## API Endpoints

### GET /api/shopify/product-config/[productId]
Retrieve the latest configuration for a product.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "product_id": "shopify-product-id",
    "variant_id": "optional-variant-id",
    "configuration_data": {
      "modelType": "Type A",
      "material": "Metal",
      "color": "Silver",
      "customText": "Custom engraving",
      "features": ["feature1", "feature2"]
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/shopify/product-config/[productId]
Create or update a product configuration.

**Request Body:**
```json
{
  "variant_id": "optional-variant-id",
  "configuration_data": {
    "modelType": "Type A",
    "material": "Metal",
    "color": "Silver",
    "customText": "Custom engraving",
    "features": ["feature1", "feature2"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "product_id": "shopify-product-id",
    "configuration_data": {...}
  }
}
```

### DELETE /api/shopify/product-config/[productId]?variant_id=[variantId]
Delete a product configuration.

**Response:**
```json
{
  "success": true,
  "message": "Configuration deleted successfully"
}
```

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel:**
   - Go to your Vercel project settings
   - Add the same environment variables from `.env.local`

### Other Platforms

The app can be deployed to any platform that supports Next.js:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

### Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t shopify-configurator .
docker run -p 3000:3000 --env-file .env.local shopify-configurator
```

## Shopify Integration

### 1. Add the API URL to your Shopify theme

In your Shopify theme, you can call the API using JavaScript:

```javascript
// Example: Save configuration
async function saveProductConfiguration(productId, configData) {
  const response = await fetch(`https://your-api-url.com/api/shopify/product-config/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      configuration_data: configData
    })
  });
  
  return await response.json();
}

// Example: Get configuration
async function getProductConfiguration(productId) {
  const response = await fetch(`https://your-api-url.com/api/shopify/product-config/${productId}`);
  return await response.json();
}
```

### 2. Handle in Shopify Checkout

You can store the configuration ID in cart attributes or line item properties to reference during checkout.

## Configuration Data Structure

The `configuration_data` field is a flexible JSON object that can store any configuration options. Common fields include:

- `modelType`: The type or model of the product
- `material`: Material selection
- `color`: Color choice
- `size`: Size selection
- `customText`: Any custom text/engraving
- `features`: Array of selected features
- `quantity`: Quantity if applicable
- `notes`: Additional notes

You can extend this structure based on your specific needs.

## Security Considerations

- The API uses Supabase service role key for database operations
- CORS is configured to allow all origins (adjust for production)
- Consider adding rate limiting for production use
- Add request validation/sanitization as needed
- For production, consider adding API key authentication

## Troubleshooting

### CORS Issues
- Ensure your API URL includes the protocol (https://)
- Check that CORS headers are properly set in `next.config.mjs`

### Database Connection
- Verify Supabase credentials are correct
- Check that the database migration has been run
- Ensure Row Level Security policies are properly configured

### Deployment Issues
- Ensure all environment variables are set in your deployment platform
- Check Node.js version compatibility (requires 18+)
- Verify build output for any errors

## Support

For issues or questions:
1. Check the error logs in your deployment platform
2. Verify database connection and migrations
3. Ensure all environment variables are correctly set

## License

MIT