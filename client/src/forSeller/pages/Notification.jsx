import React from 'react'
import InventoryManagement from '../Components/InventoryManagement ';

const Notification = () => {

        //handel inverntory
        const stocks = [
            { id: 1, name: 'Aloe Vera', stock: 5 },
            { id: 2, name: 'Cactus', stock: 12 },
            { id: 3, name: 'Money Plant', stock: 3 },
        ];
    
        const handleRestock = (productId) => {
            // Logic to handle restocking
            console.log(`Restocking product with ID: ${productId}`);
        };
    
  return (
    <div className="min-h-screen bg-gray-100">
          <div className="p-6 max-w-7xl mx-auto">    
          <h2 className="text-2xl font-bold text-green-800 mb-4">Notification</h2>
           <div className="py-4">
            <div className="space-y-4">
                {stocks.map((product) => (
                    <InventoryManagement 
                        key={product.id} 
                        product={product} 
                        onRestock={handleRestock} 
                    />
                ))}
            </div>
        </div>
        </div>
    </div>
  )
}

export default Notification