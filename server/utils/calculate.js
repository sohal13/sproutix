
export const calculateTotalAmount = (products) => {
    return products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  };

export const calculateShippingCost = (shippingAddress) => {
    // Example flat-rate shipping cost
    const flatRateShippingCost = 500; // Shipping cost in cents (e.g., $5.00)
    // You can add more complex logic here based on the shipping address if needed
    return flatRateShippingCost;
  };
  