// This is the corrected integration script for your Shopify product page
// The Liquid variables will be replaced when this is added to your template

const API_URL = 'https://standalone-configurator.vercel.app';
// Note: When adding to Shopify, replace PRODUCT_ID_PLACEHOLDER with {{ product.id }}
const productId = 'PRODUCT_ID_PLACEHOLDER';

// Load and display product configuration
async function initializeConfigurator() {
  try {
    // Fetch configuration from API
    const response = await fetch(`${API_URL}/api/shopify/product-config/${productId}`);
    const result = await response.json();
    
    if (result.success && result.data && result.data.configuration_data) {
      const config = result.data.configuration_data;
      
      // Create configurator UI
      const configuratorHTML = `
        <div class="product-configurator" style="margin: 20px 0; padding: 20px; border: 1px solid #ddd;">
          <h3>Customize Your Product</h3>
          <div id="customization-options"></div>
          <div id="price-display" style="margin-top: 20px; font-size: 18px; font-weight: bold;"></div>
        </div>
      `;
      
      // Insert after product title
      const productTitle = document.querySelector('.product__title, h1.product-single__title, .product-title');
      if (productTitle) {
        productTitle.insertAdjacentHTML('afterend', configuratorHTML);
        
        // Render options
        renderOptions(config.options || []);
      }
    }
  } catch (error) {
    console.error('Error loading product configuration:', error);
  }
}

// Render configuration options
function renderOptions(options) {
  const container = document.getElementById('customization-options');
  let totalPrice = 0;
  
  options.forEach((option, index) => {
    const optionHTML = `
      <div class="config-option" style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">${option.name}:</label>
        <select id="option-${index}" data-option-index="${index}" style="width: 100%; padding: 8px;">
          ${option.values.map(value => `
            <option value="${value.name}" data-price="${value.price || 0}">
              ${value.name} ${value.price > 0 ? `(+$${value.price})` : ''}
            </option>
          `).join('')}
        </select>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', optionHTML);
    
    // Add change listener
    document.getElementById(`option-${index}`).addEventListener('change', updatePrice);
  });
  
  updatePrice();
}

// Update price based on selections
function updatePrice() {
  let additionalPrice = 0;
  const selects = document.querySelectorAll('.config-option select');
  
  selects.forEach(select => {
    const selectedOption = select.options[select.selectedIndex];
    additionalPrice += parseFloat(selectedOption.dataset.price || 0);
  });
  
  const priceDisplay = document.getElementById('price-display');
  if (additionalPrice > 0) {
    priceDisplay.textContent = `Additional Cost: $${additionalPrice.toFixed(2)}`;
  } else {
    priceDisplay.textContent = '';
  }
}

// Override add to cart to include customizations
function overrideAddToCart() {
  const addToCartForm = document.querySelector('form[action="/cart/add"]');
  if (!addToCartForm) return;
  
  addToCartForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get selected options
    const selections = {};
    const selects = document.querySelectorAll('.config-option select');
    selects.forEach(select => {
      const optionIndex = select.dataset.optionIndex;
      selections[`option_${optionIndex}`] = select.value;
    });
    
    // Get original form data
    const formData = new FormData(addToCartForm);
    const cartData = {
      id: formData.get('id'),
      quantity: formData.get('quantity') || 1,
      properties: selections
    };
    
    // Add to cart with properties
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData)
      });
      
      if (response.ok) {
        // Redirect to cart or show success message
        window.location.href = '/cart';
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeConfigurator();
    overrideAddToCart();
  });
} else {
  initializeConfigurator();
  overrideAddToCart();
}