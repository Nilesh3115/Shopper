import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import Bredcrums from '../Components/Breadcrums/Bredcrums';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const product = all_product.find((e) => e.id === Number(productId));
  console.log(all_product,"test")
  return (
    <div>
      <Bredcrums product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts all_product={all_product} />
    </div>
  )
}

export default Product
