// Trạng thái chung cho các đối tượng
export const CommonStatus = {
  active: "Hoạt động",
  inactive: "Tạm dừng",
};

// Trạng thái chung cho thanh toán
export const PayStatus = {
  pay: "Đã thanh toán",
  notPay: "Chưa thanh toán",
};

// Trạng thái chung cho đối tượng sử dụng bàn
export const UseTableStatus = {
  occupied: "Đang có khách",
  reserved: "Đã đặt bàn",
  empty: "Đang trống",
  repair: "Đang bảo trì",
};

// Trạng thái chung cho đối tượng phiếu gọi món
export const OrderSheetStatus = {
  serviced: "Đã phục vụ",
  confirm: "Đang làm món",
  canceled: "Đã huỷ phiếu",
  pending: "Đang chờ xác nhận",
};

// Trạng thái chung cho đối tượng đơn món ăn
export const OrderStatus = {
  confirm: "Đã xác nhận",
  canceled: "Đã huỷ đơn",
  pending: "Đang chờ xác nhận",
};

// Trạng thái chung cho đối tượng phiếu nhập hàng
export const InputTicketStatus = {
  giveback: "Đã trả hàng",
  confirm: "Đã nhập hàng",
  canceled: "Đã huỷ phiếu",
  pending: "Đang chờ xác nhận",
};

// Trạng thái chung cho đối tượng món ăn
export const FoodStatus = {
  active: "Đang bán",
  inactive: "Dừng bán",
};
