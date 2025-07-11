import { useParams, useSearchParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import ProductGrid from "../components/Products/ProductGrid";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000";

function Collection() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCollectionAndProducts = async () => {
      try {
        // Tìm collection theo id (string)
        const collections = await axios.get(`${API_URL}/api/collections`);
        const collection = collections.data.find((c) => c.id === id);

        if (!collection) {
          setError("Không tìm thấy bộ sưu tập");
          setLoading(false);
          return;
        }

        setCollection(collection);

        // Lấy params filter từ URL
        const params = Object.fromEntries(searchParams.entries());

        // Gọi API lấy sản phẩm theo collection id
        const productsRes = await axios.get(
          `${API_URL}/api/collections/${id}/products`,
          { params }
        );
        setProducts(productsRes.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu bộ sưu tập");
        setLoading(false);
      }
    };
    fetchCollectionAndProducts();
  }, [id, searchParams]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOutsideClick = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  if (loading) return <div className="text-center mt-10">Đang tải...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!collection) return <h2>Không tìm thấy bộ sưu tập!</h2>;

  console.log("collection state:", collection);

  return (
    <div className="flex flex-col">
      {/* banner */}
      <div className="w-full px-4 md:px-[100px] my-6 md:my-[50px]">
        <div className="flex flex-row justify-center items-center border w-full border-gray-400">
          <div className="flex flex-col w-1/2 p-6 md:p-10 gap-2 justify-center">
            <h2 className="text-xl md:text-4xl font-medium uppercase">
              {collection.name}
            </h2>
            <p className="text-xs md:text-xl font-light">
              {collection.description}
            </p>
          </div>
          <img
            src={collection.bannerUrl}
            alt={collection.name}
            className="w-full md:w-1/2 h-[300px] md:h-[500px] items-center object-cover overflow-hidden"
          />
        </div>
      </div>
      {/* filter and sort */}
      <div className="w-full h-10 px-[50px] flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="filter-button flex items-center gap-2 rounded-full border border-black px-4 py-1.5 transition-all hover:shadow-[inset_0_0_0_1px_black] cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
          <span className="text-sm">Bộ lọc</span>
        </button>
        {/* overlay */}
        <div
          className={`fixed inset-0 w-screen h-full bg-black/75 z-50 transition-[opacity,visibility] duration-200 ease-in-out ${
            isSidebarOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />
        {/* filter sidebar */}
        <div
          ref={sidebarRef}
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 z-50 left-0 w-80 overflow-y-auto transition-transform duration-300 ease-in-out bg-white`}
        >
          <FilterSidebar />
        </div>
        {/* sort options */}
        <div>
          <SortOptions />
        </div>
      </div>
      <p className="text-black text-[20px] font-medium my-2 px-[50px]">
        {products.length} sản phẩm
      </p>
      {console.log("products state:", products)}
      {/* Hiển thị "Không tìm thấy sản phẩm" nếu không có kết quả */}
      {products.length === 0 ? (
        <div className="w-full px-[50px] text-center py-10">
          <p className="text-gray-500">
            Không tìm thấy sản phẩm phù hợp với bộ lọc đã chọn
          </p>
        </div>
      ) : (
        <div className="w-full px-[50px]">
          <ProductGrid products={products} />
        </div>
      )}
    </div>
  );
}

export default Collection;
