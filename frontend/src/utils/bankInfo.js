import { API_URL } from "./api";

// Thông tin ngân hàng cho chuyển khoản
export const BANK_INFO = {
  bankName: "MB Bank",
  accountNumber: "7318032005",
  accountName: "CONG TY THOI TRANG WUKUDADA",
  bankCode: "970422", // Mã ngân hàng Vietcombank cho VietQR

  // Cấu hình VietQR
  vietqr: {
    template: "compact2",
    baseUrl: "https://img.vietqr.io/image",
  },

  // Thông tin liên hệ
  contact: {
    hotline: "1900 1234",
    processingTime: "1-2 giờ trong giờ hành chính",
  },
};

// Hàm tạo URL VietQR
export const generateVietQRUrl = (amount, orderCode, phone) => {
  const { bankCode, accountNumber, accountName, vietqr } = BANK_INFO;
  const transferContent = `${orderCode} ${phone}`;

  return `${vietqr.baseUrl}/${bankCode}-${accountNumber}-${
    vietqr.template
  }.png?amount=${amount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(accountName)}`;
};

// Hàm tạo mã đơn hàng
export const generateOrderCode = () => {
  return `DH${Date.now().toString().slice(-6)}`;
};

// Fallback SVG cho QR code (224x224px)
export const QR_FALLBACK_SVG =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjI0IiBoZWlnaHQ9IjIyNCIgdmlld0JveD0iMCAwIDIyNCAyMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMjQiIGhlaWdodD0iMjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMTIgMTY4QzE0MS4wNjEgMTY4IDE2NCAxNDUuMDYxIDE2NCAxMTJDMTY0IDc4LjkzOSAxNDEuMDYxIDU2IDExMiA1NkM4Mi45MzkgNTYgNjAgNzguOTM5IDYwIDExMkM2MCAxNDUuMDYxIDgyLjkzOSAxNjggMTEyIDE2OFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIzIi8+Cjwvc3ZnPgo=";

// Kiểm tra thanh toán thành công từ danh sách giao dịch
export function checkPaymentSuccess(transactions, orderCode, amount, phone) {
  if (!Array.isArray(transactions)) return null;
  const now = new Date();
  const orderCodeNorm = orderCode.trim().toLowerCase();
  const phoneNorm = phone.replace(/\D/g, "");
  for (const tx of transactions) {
    const moTa = (tx.moTa || "").toLowerCase();
    const hasOrderCode = moTa.includes(orderCodeNorm);
    const hasPhone = moTa.includes(phoneNorm);
    const amountMatch = Math.abs(Number(tx.giaTri) - Number(amount)) <= 1000;
    const timeDiff = now - new Date(tx.ngayDienRa);
    const isRecent = timeDiff >= 0 && timeDiff <= 24 * 60 * 60 * 1000;
    // DEBUG LOG
    console.log("[checkPaymentSuccess]", {
      moTa,
      orderCodeNorm,
      phoneNorm,
      hasOrderCode,
      hasPhone,
      amount: Number(amount),
      txAmount: Number(tx.giaTri),
      amountMatch,
      txTime: tx.ngayDienRa,
      now: now.toISOString(),
      timeDiff,
      isRecent,
    });
    if (hasOrderCode && hasPhone && amountMatch && isRecent) {
      return tx;
    }
  }
  return null;
}

/**
 * Gọi API Google Apps Script lấy 5 giao dịch gần nhất và kiểm tra thanh toán
 * @param {string} orderCode - Mã đơn hàng
 * @param {number} amount - Số tiền
 * @param {string} phone - Số điện thoại
 * @returns {Promise<object|null>} Object giao dịch nếu tìm thấy, null nếu không
 */
export async function fetchRecentTransactionsAndCheckPayment(
  orderCode,
  amount,
  phone
) {
  const API_URL =
    API_URL +
    "/api/payment/check?orderCode=" +
    encodeURIComponent(orderCode) +
    "&amount=" +
    encodeURIComponent(amount) +
    "&phone=" +
    encodeURIComponent(phone);
  try {
    const res = await fetch(API_URL);
    if (!res.ok)
      throw new Error("Không thể lấy dữ liệu giao dịch từ API backend");
    const data = await res.json();
    // DEBUG LOG: In ra danh sách giao dịch lấy được từ backend
    console.log(
      "[fetchRecentTransactionsAndCheckPayment] transactions:",
      data.transactions
    );
    // DEBUG LOG: In ra nội dung đối chiếu
    console.log("[fetchRecentTransactionsAndCheckPayment] Đối chiếu với:", {
      orderCode,
      amount,
      phone,
    });
    return checkPaymentSuccess(data.transactions, orderCode, amount, phone);
  } catch (err) {
    console.error("Lỗi khi kiểm tra thanh toán:", err);
    return {
      error: true,
      message:
        "Không thể kết nối đến máy chủ xác thực thanh toán. Vui lòng thử lại sau!",
    };
  }
}
