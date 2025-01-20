import { forwardRef, memo } from 'react';
import { Product } from '../../types/productTypes';

interface ProductCardProps {
  product: Product;
}

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(({ product }, ref) => {
    return (
    <div ref={ref}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <img
            loading="lazy"
            src={product.thumbnail}
            alt={product.title}
            width={50}
            height={50}
        />
        <div>
            <label><b>{product.title}</b></label>
            <br/>
            <span> ${product.price.toFixed(2)} </span>
        </div>
      </div>
    </div>
  );
});


export default memo(ProductCard);