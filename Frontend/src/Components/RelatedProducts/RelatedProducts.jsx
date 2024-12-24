import React from 'react';
import './RelatedProducts.css';
import Item from '../Item/Item';

// Function to shuffle an array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const RelatedProducts = (props) => {
  const shuffledProducts = shuffleArray(props?.all_product || []);

  return (
    <div className="relatedproducts">
      <h1>RELATED PRODUCTS</h1>
      <hr />
      <div className="relatedproducts-item">
        {shuffledProducts.slice(0, 4).map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
