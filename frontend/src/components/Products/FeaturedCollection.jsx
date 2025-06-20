import React from "react";
import { Link } from "react-router-dom";

const FeaturedCollection = ({ collections }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full grid grid-cols-1 gap-8">
        {collections.map((col) => {
          // Lấy 4 sản phẩm đầu tiên của BST
          const featured = col.products.slice(0, 4);
          // if (featured.length === 0) return null;
          return (
            <div key={col.id} className="featured-collection overflow-hidden">
              <Link to={`/collections/${col.id}`}>
                <div className="relative">
                  <img
                    src={col.bannerUrl}
                    alt={col.name}
                    className="w-full h-48 sm:h-72 md:h-[400px] lg:h-[600px] xl:h-[750px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
                    <h2 className="text-lg sm:text-2xl font-bold text-white">
                      {col.name}
                    </h2>
                  </div>
                </div>
              </Link>
              <div className="px-2 sm:px-8 md:px-20 lg:px-[150px] pt-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 ">
                  {featured.map((p) => (
                    <Link
                      key={p._id}
                      to={`/product/${p._id}`}
                      className="group cursor-pointer"
                    >
                      <div className="flex flex-col justify-between w-full aspect-[3/4]">
                        {/* ảnh */}
                        <div className="h-[80%] overflow-hidden">
                          <img
                            src={p.images[0].url}
                            alt={p.images[0].altText || p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* mô tả */}
                        <div className="flex flex-col gap-1 p-4">
                          <h3 className="text-sm group-hover:underline transition-colors duration-300">
                            {p.name}
                          </h3>
                          <p className="text-black font-medium text-lg">
                            {p.discountPrice
                              ? p.discountPrice.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })
                              : p.price.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedCollection;
