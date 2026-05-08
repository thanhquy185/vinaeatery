// Đường dẫn ảnh
export const ImageSourcePath = "/src/assets/images/";

// Các giá trị cho việc sử dụng react query để truy vấn dữ liệu
export const ReactQueryGetData = {
  retry: 2, // cho phép retry dữ liệu 2 lần
  staleTime: 1000 * 60, // cache dữ liệu sau mỗi 1 phút
};

// Modal
// - Layout
export const ModalLayout = "vertical";
// - Autocomplete
export const ModalAutoComplete = "off";
// - Tiêu đề
export const ModalTitleValue = {
  detail: (objectName: string) => "Chi tiết " + objectName,
  create: (objectName: string) => "Thêm " + objectName,
  update: (objectName: string) => "Cập nhật " + objectName,
  lock: (objectName: string) => "Khoá " + objectName,
  unlock: (objectName: string) => "Mở khoá " + objectName,
  print: (objectName: string) => "In " + objectName,
  changePassword: (objectName: string) => "Thay đổi mật khẩu " + objectName,
  handle: (objectName: string) => "Xử lý " + objectName,
};
// - Chiều rộng
export const ModalWidthValue = {
  active: "90%",
  split3B: "95%",
  split3: "89%",
  split2: "60%",
  split1: "31%",
  lock: "30%",
};

// Quyền tài khoản người dùng
export const UserRoleValue = {
  admin: "Quản trị hệ thống",
  manager: "Chủ nhà hàng",
  employee: "Nhân viên nhà hàng",
  customer: "Khách hàng",
};

// Phương thức tạo tài khoản người dùng
export const UserMethodValue = {
  facebook: "Tạo tài khoản bằng Facebook",
  google: "Tạo tài khoản bằng Google",
  handmade: "Tạo tài khoản thủ công",
};

// Trạng thái sử dụng tài khoản người dùng
export const UserIsUsingValue = {
  notUsing: "Chưa sử dụng",
  using: "Đang sử dụng",
};

// Giới tính chung
export const CommonGender = {
  male: "Nam",
  female: "Nữ",
};

// Phụ thu loại bàn
export const CategoryTableSurchargeType = {
  fixed: "Tiền cố định",
  percent: "Phần trăm tiền món ăn",
};

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

// Trạng thái xử lý chung cho xử lý thanh toán
export const HandlePaymentStatus = {
  nothing: "Chưa có hoá đơn thanh toán",
  exists: "Đã có hoá đơn thanh toán",
  pending: "Đang chọn phương thức thanh toán",
  selected: "Đã chọn phương thức thanh toán",
  completed: "Đã hoàn tất thanh toán hoá đơn",
  feedback: "Đã hoàn tất đánh giá cửa hàng",
};

// Trạng thái chung cho đối tượng sử dụng bàn ăn
export const UseTableStatus = {
  occupied: "Đang có khách",
  reserved: "Đã đặt bàn",
  empty: "Đang trống",
  repair: "Đang bảo trì",
};

// Trạng thái crung cho đối tượng sử dụng món ăn
export const UseFoodStatus = {
  canOrder: "Còn phục vụ",
  canNotOrder: "Hết phục vụ",
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

// Trạng thái chung cho bảng lương
export const PayslipStatus = {
  full: "Làm đủ giờ",
  noFull: "Làm thiếu giờ",
  absent: "Không đi làm",
  unknown: "Chưa xác nhận",
};

// Lý do nghỉ cho chấm công
export const AttendanceLeave = {
  paid: "Nghỉ phép (hưởng lương)",
  unpaid: "Nghỉ phép (không lương)",
  sick: "Nghỉ ốm",
  family: "Chuyện gia đình",
  work: "Đi công tác",
};

// Trạng thái chung cho chấm công
export const AttendanceStatus = {
  full: "Đủ công",
  half: "Nửa công",
  absent: "Nghỉ làm",
  pending: "Chưa chấm công",
};

// Hành động của máy chấm công
export const MachineLogAction = {
  in: "Vào làm",
  out: "Rời làm",
};

// Trạng thái chung cho đối tượng ứng lương
export const SalaryAdvanceStatus = {
  confirm: "Đã xác nhận",
  canceled: "Đã huỷ đơn",
  pending: "Đang chờ xác nhận",
};

// Trạng thái chung cho đối tượng đơn xin phép
export const PermissionTicketStatus = {
  confirm: "Đã xác nhận",
  canceled: "Đã huỷ đơn",
  pending: "Đang chờ xác nhận",
};

// Trạng thái chung cho đối tượng thưởng - phạt
export const RewardPunishStatus = {
  confirm: "Đã xác nhận",
  canceled: "Đã huỷ đơn",
  pending: "Đang chờ xác nhận",
};

// Xử lý chung cho loại thưởng - phạt
export const CategoryRewardPunishHandle = {
  reward: "Thưởng",
  punish: "Phạt",
};

// Kiểu tính lương cho đối tượng chức vụ
export const RoleSalaryType = {
  fixed: "Lương cố định",
  hours: "Lương theo giờ",
};

// Trạng thái của nhân viên
export const EmployeeStatus = {
  active: "Đang làm",
  inactive: "Nghỉ làm",
};
