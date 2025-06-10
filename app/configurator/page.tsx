'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ProductConfig {
  shopify_product_id: string
  shopify_variant_id?: string
  configuration_data: any
  active: boolean
}

export default function ConfiguratorPage() {
  const [configs, setConfigs] = useState<ProductConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    shopify_product_id: '',
    configuration_data: {
      options: [
        {
          name: 'Wood Type',
          type: 'variant',
          values: [
            { name: 'Walnut', priceModifier: 0, sku: 'WAL' },
            { name: 'Cherry', priceModifier: 100, sku: 'CHR' }
          ]
        }
      ]
    }
  })

  const supabase = createClient()

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('product_configurations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setConfigs(data || [])
    } catch (error) {
      console.error('Error fetching configs:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    try {
      const { error } = await supabase
        .from('product_configurations')
        .upsert({
          shopify_product_id: formData.shopify_product_id,
          configuration_data: formData.configuration_data,
          active: true
        }, {
          onConflict: 'shopify_product_id'
        })

      if (error) throw error

      alert('Configuration saved!')
      setFormData({
        shopify_product_id: '',
        configuration_data: { options: [] }
      })
      fetchConfigs()
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Error saving configuration')
    }
  }

  const deleteConfig = async (id: string) => {
    if (!confirm('Delete this configuration?')) return

    try {
      const { error } = await supabase
        .from('product_configurations')
        .delete()
        .eq('shopify_product_id', id)

      if (error) throw error
      fetchConfigs()
    } catch (error) {
      console.error('Error deleting config:', error)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Product Configuration Manager</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add/Edit Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Shopify Product ID
              </label>
              <input
                type="text"
                value={formData.shopify_product_id}
                onChange={(e) => setFormData({ ...formData, shopify_product_id: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., 8765432109"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Configuration Data (JSON)
              </label>
              <textarea
                value={JSON.stringify(formData.configuration_data, null, 2)}
                onChange={(e) => {
                  try {
                    const data = JSON.parse(e.target.value)
                    setFormData({ ...formData, configuration_data: data })
                  } catch (err) {
                    // Invalid JSON, ignore
                  }
                }}
                className="w-full border rounded px-3 py-2 font-mono text-sm"
                rows={15}
              />
            </div>

            <button
              onClick={saveConfig}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Save Configuration
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold p-6 border-b">Saved Configurations</h2>
          
          <div className="divide-y">
            {configs.map((config) => (
              <div key={config.shopify_product_id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">Product ID: {config.shopify_product_id}</h3>
                    <pre className="mt-2 text-sm bg-gray-50 p-3 rounded overflow-x-auto">
                      {JSON.stringify(config.configuration_data, null, 2)}
                    </pre>
                  </div>
                  <div className="ml-4 space-x-2">
                    <button
                      onClick={() => {
                        setFormData({
                          shopify_product_id: config.shopify_product_id,
                          configuration_data: config.configuration_data
                        })
                        window.scrollTo(0, 0)
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteConfig(config.shopify_product_id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}