import React, { useEffect, useState, useMemo } from 'react';
import { fetchProducts, searchProducts } from '../../services/productApi';
import { Product } from '../../types/productTypes';
import ProductItem from './ProductItem';
import { debounce } from '../../utils/debounce';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll ';


const SEARCH_DEBOUNCE_MS = 400;
const PRODUCTS_PER_PAGE = 20;

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [skip, setSkip] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    
    
    const loadProducts = async (searchQuery: string) => {
        try {
            setLoading(true);
            const data = searchQuery ? await searchProducts(searchQuery, skip) : await fetchProducts(skip);
            setProducts(prev => {
                const newProducts = [...prev, ...data.products];
                setHasMore(newProducts.length < data.total);
                return newProducts;
            });
        } catch (error) {
            setError('Failed to load products. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useMemo(() => {
        const handler = (query: string) => {
          setSearchQuery(query);
          setSkip(0);
          setProducts([]);
        };
    
        return debounce(handler, SEARCH_DEBOUNCE_MS);
      }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(event.target.value);
    };

    const lastProductRef = useInfiniteScroll({
        loading,
        hasMore,
        onLoadMore: () => setSkip(prev => prev + PRODUCTS_PER_PAGE),
    });

    useEffect(() => { 
        loadProducts(searchQuery) 
    }, [skip, searchQuery]);

    const productList = useMemo(() => (
        products.map((product, index) => (
            <ProductItem
                key={product.id}
                product={product}
                ref={index === products.length - 1 ? lastProductRef : undefined}
            />
        ))
    ), [products, lastProductRef]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search products..."
                onChange={handleSearch}
            />
            <div>
                {productList}
            </div>
            {
                products.length === 0 && !loading && <span>No products found!</span>
            }
            {loading && <span>Loading product...</span>}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default ProductList;