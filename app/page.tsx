import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          ZMF Product Configurator API
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">API Endpoints</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-mono text-lg text-blue-600">
                GET /api/shopify/product-config/[productId]
              </h3>
              <p className="text-gray-600">
                Fetch configuration for a specific product
              </p>
            </div>
            
            <div>
              <h3 className="font-mono text-lg text-green-600">
                POST /api/shopify/product-config/[productId]
              </h3>
              <p className="text-gray-600">
                Create or update product configuration
              </p>
            </div>
            
            <div>
              <h3 className="font-mono text-lg text-red-600">
                DELETE /api/shopify/product-config/[productId]
              </h3>
              <p className="text-gray-600">
                Delete product configuration
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Deploy this app to Vercel or your preferred platform</li>
            <li>Set up your Supabase database with the provided migration</li>
            <li>Configure environment variables</li>
            <li>Test the API endpoint with your Shopify product IDs</li>
          </ol>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Management UI</h2>
          <p className="text-gray-600 mb-4">
            Use the configuration manager to set up your product options:
          </p>
          <Link 
            href="/configurator"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Open Configuration Manager
          </Link>
        </div>
      </div>
    </div>
  )
}