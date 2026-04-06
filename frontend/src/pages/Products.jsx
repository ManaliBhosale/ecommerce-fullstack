import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/product';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Other'];

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const keyword = searchParams.get('keyword') || '';

  const [searchInput, setSearchInput] = useState(keyword);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (category && category !== 'All') params.category = category;
        if (keyword) params.keyword = keyword;

        const { data } = await getProducts(params);
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, category, keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const params = {};
    if (searchInput) params.keyword = searchInput;
    if (category && category !== 'All') params.category = category;
    setSearchParams(params);
  };

  const handleCategory = (cat) => {
    setPage(1);
    const params = {};
    if (cat && cat !== 'All') params.category = cat;
    if (keyword) params.keyword = keyword;
    setSearchParams(params);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>
        Products {total > 0 && <span style={{ color: '#777', fontSize: '1rem' }}>({total})</span>}
      </h2>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products..."
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '0.95rem',
          }}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`btn ${(category === cat || (!category && cat === 'All')) ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            onClick={() => handleCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : products.length === 0 ? (
        <p style={{ color: '#777', textAlign: 'center', padding: '40px' }}>
          No products found.
        </p>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`btn ${p === page ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '6px 14px' }}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Products;
