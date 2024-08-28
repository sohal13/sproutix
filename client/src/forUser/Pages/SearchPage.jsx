import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import { FaFilter, FaTimes } from "react-icons/fa";
import ProductCard from "../../components/ProductCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import apiClient from "../../apiClient";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialQuery = {
    name: queryParams.get("query") || "",
    page: queryParams.get("page") || 1,
    limit: queryParams.get("limit") || 10,
    sortBy: queryParams.get("sortBy") || 'createdAt',
    order: queryParams.get("order") || 'desc',
    minPrice: queryParams.get("minPrice") || "",
    maxPrice: queryParams.get("maxPrice") || "",
    minRating: queryParams.get("minRating") || "",
    maxRating: queryParams.get("maxRating") || "",
    category: queryParams.get("category") || "",
    brand: queryParams.get("brand") || "",
    climate: queryParams.get("climate") || "",
    lightRequirement: queryParams.get("lightRequirement") || "",
    waterRequirement: queryParams.get("waterRequirement") || "",
    soilType: queryParams.get("soilType") || "",
    featured: queryParams.get("featured") || "",
  };

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/api/product/search', { params: searchQuery });
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const newSearchQuery = {
      name: query.get("query") || "",
      page: query.get("page") || 1,
      limit: query.get("limit") || 10,
      sortBy: query.get("sortBy") || 'createdAt',
      order: query.get("order") || 'desc',
      minPrice: query.get("minPrice") || "",
      maxPrice: query.get("maxPrice") || "",
      minRating: query.get("minRating") || "",
      maxRating: query.get("maxRating") || "",
      category: query.get("category") || "",
      brand: query.get("brand") || "",
      climate: query.get("climate") || "",
      lightRequirement: query.get("lightRequirement") || "",
      waterRequirement: query.get("waterRequirement") || "",
      soilType: query.get("soilType") || "",
      featured: query.get("featured") || "",
    };
    setSearchQuery(newSearchQuery);
  }, [location.search]);

  const handlePageChange = (page) => {
    setSearchQuery((prevQuery) => ({ ...prevQuery, page }));
    navigate(`/search?${new URLSearchParams({ ...searchQuery, page }).toString()}`);
  };

  const handleFilterChange = (e) => {
    setSearchQuery((prevQuery) => ({
      ...prevQuery,
      [e.target.name]: e.target.value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  return (
    <Layout>
      <div className="p-4 max-w-screen-full mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-4 bg-green-600 p-1 rounded relative">
          <button
            className="flex items-center text-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="mr-2 text-white" />
            Filters
          </button>

          {showFilters && (
            <div className="absolute top-full left-0 w-full bg-white p-4 rounded-lg shadow-lg z-10">
              <button
                className="absolute top-0 rounded-full text-gray-900  bg-red-400 right-0 hover:bg-red-600 "
                onClick={() => setShowFilters(false)}
              >
                <FaTimes className="w-6 h-6 px-1 py-1"/>
              </button>

              <div className="flex flex-col md:flex-row gap-2 md:gap-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min Price"
                  className="py-2 px-4 border rounded-lg w-full md:w-auto"
                  value={searchQuery.minPrice}
                  onChange={handleFilterChange}
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price"
                  className="py-2 px-4 border rounded-lg w-full md:w-auto"
                  value={searchQuery.maxPrice}
                  onChange={handleFilterChange}
                />
                <input
                  type="number"
                  name="minRating"
                  placeholder="Min Rating"
                  className="py-2 px-4 border rounded-lg w-full md:w-auto"
                  value={searchQuery.minRating}
                  onChange={handleFilterChange}
                />
                <input
                  type="number"
                  name="maxRating"
                  placeholder="Max Rating"
                  className="py-2 px-4 border rounded-lg w-full md:w-auto"
                  value={searchQuery.maxRating}
                  onChange={handleFilterChange}
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  className="py-2 px-4 border rounded-lg w-full md:w-auto"
                  value={searchQuery.category}
                  onChange={handleFilterChange}
                />
                <input
                  type="text"
                  name="brand"
                  placeholder="Brand"
                  className="py-2 px-4 border rounded-lg w-full md:w-auto"
                  value={searchQuery.brand}
                  onChange={handleFilterChange}
                />
                {/* Add more filter inputs as needed */}
              </div>
              <button
                className="bg-green-600 text-white py-2 px-4 rounded-lg mt-4 w-full"
                onClick={applyFilters}
              >
                Filter Now
              </button>
            </div>
          )}
        </div>
{/* showing the product hare */}
        {loading ? (
        <LoadingSpinner/>
        ) : error ? (
          <div className="text-center text-red-600 py-4">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4 gap-2 p-2">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="flex flex-row justify-between items-center mt-4">
              <button
                className="bg-green-300 text-black py-2 px-4 rounded-lg mb-2 md:mb-0"
                onClick={() => handlePageChange(searchQuery.page - 1)}
                disabled={searchQuery.page <= 1}
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {searchQuery.page} of {Math.ceil(total / searchQuery.limit)}
              </span>
              <button
                className="bg-green-300 text-black py-2 px-4 rounded-lg mb-2 md:mb-0"
                onClick={() => handlePageChange(Number(searchQuery.page) + 1)}
                disabled={searchQuery.page >= Math.ceil(total / searchQuery.limit)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
