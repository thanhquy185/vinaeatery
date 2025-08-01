// Các giá trị cho việc sử dụng react query để truy vấn dữ liệu
export const ReactQueryGetData = {
  retry: 2, // cho phép retry dữ liệu 2 lần
  staleTime: 1000 * 60, // cache dữ liệu sau mỗi 1 phút
}

// Các tiêu đề chung của modal
export const TitleModalCommon = {
  detail: (objectName: string) => "Chi tiết " + objectName,
  create: (objectName: string) => "Thêm " + objectName,
  update: (objectName: string) => "Cập nhật " + objectName,
  lock: (objectName: string) => "Khoá " + objectName,
  unlock: (objectName: string) => "Mở khoá " + objectName,
  print: (objectName: string) => "In " + objectName,
  changePassword: (objectName: string) => "Thay đổi mật khẩu" + objectName,
}

// Giới tính chung
export const CommonGender = {
  male: "Nam",
  female: "Nữ",
}

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
