import React from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "./OrderContext";

const MyOdersPage = () => {
  const { orders, loading, error } = useOrders();
  const navigate = useNavigate();

  // Helper function để format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Helper function để translate status
  const getStatusLabel = (status) => {
    const statusMap = {
      Processing: "Đang xử lý",
      Shipped: "Đang giao",
      Delivered: "Đã giao",
      Cancelled: "Đã hủy",
      preparing: "Đang chuẩn bị",
      shipping: "Đang giao",
      delivered: "Đã giao",
    };
    return statusMap[status] || status;
  };

  // Helper function để get status color
  const getStatusColor = (status) => {
    const colorMap = {
      Processing: "text-yellow-600 bg-yellow-100",
      preparing: "text-yellow-600 bg-yellow-100",
      Shipped: "text-blue-600 bg-blue-100",
      shipping: "text-blue-600 bg-blue-100",
      Delivered: "text-green-600 bg-green-100",
      delivered: "text-green-600 bg-green-100",
      Cancelled: "text-red-600 bg-red-100",
    };
    return colorMap[status] || "text-gray-600 bg-gray-100";
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 p-4 sm:p-6 md:p-8">
        <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4 text-center md:text-left md:mb-10">
          ĐƠN HÀNG CỦA TÔI
        </h3>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Đang tải đơn hàng...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 p-4 sm:p-6 md:p-8">
        <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4 text-center md:text-left md:mb-10">
          ĐƠN HÀNG CỦA TÔI
        </h3>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">❌ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 p-4 sm:p-6 md:p-8">
      <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4 text-center md:text-left md:mb-10">
        ĐƠN HÀNG CỦA TÔI
      </h3>
      <div className="relative border border-gray-200 overflow-x-auto">
        <div className="w-full min-w-[520px] sm:min-w-[700px]">
          <table className="min-w-full text-left text-gray-500 text-[11px] sm:text-xs md:text-sm">
            <thead className="bg-gray-100 text-[10px] sm:text-xs uppercase text-gray-700">
              <tr>
                <th className="py-1 px-1 sm:px-4 sm:py-3 whitespace-nowrap">
                  Mã đơn
                </th>
                <th className="py-1 px-1 sm:px-4 sm:py-3 whitespace-nowrap">
                  Ngày tạo
                </th>
                <th className="py-1 px-1 sm:px-4 sm:py-3 whitespace-nowrap">
                  Sản phẩm
                </th>
                <th className="py-1 px-1 sm:px-4 sm:py-3 whitespace-nowrap">
                  Tổng tiền
                </th>
                <th className="py-1 px-1 sm:px-4 sm:py-3 whitespace-nowrap">
                  Giao hàng
                </th>
                <th className="py-1 px-1 sm:px-4 sm:py-3 whitespace-nowrap">
                  Thanh toán
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/profile/orders/${order._id}`)}
                  >
                    <td className="py-2 px-2 sm:px-4 sm:py-4 font-medium text-gray-900 whitespace-nowrap text-xs sm:text-sm">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm">
                      {new Date(
                        order.createdAt || order.createAt
                      ).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm">
                      {(order.orderItems || order.oderItems || []).map(
                        (item, index) => (
                          <div key={index} className="mb-1">
                            {item.name || item.product?.name} (x{item.quantity})
                          </div>
                        )
                      )}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm font-medium">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`flex items-center gap-1 w-max px-2 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${getStatusColor(
                          order.status || order.deliveryStatus
                        )}`}
                      >
                        {getStatusLabel(order.status || order.deliveryStatus)}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`flex items-center gap-1 w-max px-2 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : order.paymentStatus === "Refunded"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.paymentStatus === "Paid"
                          ? "Đã thanh toán"
                          : order.paymentStatus === "Refunded"
                          ? "Đã hoàn tiền"
                          : "Chưa thanh toán"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 px-4 text-gray-500 text-sm"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-gray-300 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <p>Bạn chưa có đơn hàng nào</p>
                      <button
                        onClick={() => navigate("/")}
                        className="mt-2 px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors"
                      >
                        Mua sắm ngay
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOdersPage;
