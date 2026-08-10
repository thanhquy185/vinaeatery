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
  changePasswordUser: (objectName: string) => "Thay đổi mật khẩu " + objectName,
  handle: (objectName: string) => "Xử lý " + objectName,
};
// - Chiều rộng
export const ModalWidthValue = {
  active: "80%",
  split3B: "95%",
  split3: "89%",
  split2: "60%",
  split1: "31%",
  lock: "30%",
};

// Các giá trị cho lọc dữ liệu Thống kê
// - Mốc thời gian
export const FilterDashboardTimelineValue = {
  year: "Theo năm",
  quarter: "Theo quý",
  month: "Theo tháng",
};
// - Khoảng năm
export const FilterDashboardYearRangeValue = {
  start: 2020,
  end: 2030,
};

// Trạng thái chung cho nhiều đối tượng
export const CommonStatusValue = {
  active: "Hoạt động",
  inactive: "Tạm dừng",
};

// Giới tính chung cho nhiều đối tượng
export const CommonGenderValue = {
  male: "Nam",
  female: "Nữ",
};

// Quyền tài khoản Người dùng
export const UserRoleValue = {
  admin: "Quản trị hệ thống",
  manager: "Chủ nhà hàng",
  employee: "Nhân viên nhà hàng",
  customer: "Khách hàng",
};

// Phương thức tạo tài khoản Người dùng
export const UserMethodValue = {
  handmade: "Tạo tài khoản thủ công",
  google: "Tạo tài khoản bằng Google",
  facebook: "Tạo tài khoản bằng Facebook",
};

// Trạng thái Thanh toán POS
export const PaymentMachineStatusValue = {
  processing: "Đang xử lý",
  cancelled: "Đã huỷ bỏ",
  completed: "Đã hoàn thành",
};

// Trạng thái xử lý Thanh toán POS
export const PaymentMachineProcessStatusValue = {
  pending: "Đang chọn phương thức thanh toán",
  cancelled: "Huỷ thanh toán hoá đơn",
  selected: "Đã chọn phương thức thanh toán",
  completed: "Đã hoàn tất thanh toán hoá đơn",
  feedback: "Đã hoàn tất đánh giá cửa hàng",
};

// Trạng thái Sử dụng bàn ăn
export const UseTableStatusValue = {
  repair: "Đang bảo trì",
  empty: "Đang trống",
  reserved: "Đã đặt bàn",
  occupied: "Đang có khách",
};

// Trạng thái Sử dụng món ăn
export const UseFoodStatusValue = {
  can_order: "Còn phục vụ",
  can_not_order: "Hết phục vụ",
};

// Trải nghiệm Đánh giá
export const FeedbackExperienceValue = {
  bad: "Dở tệ",
  no_good: "Không hài lòng",
  normal: "Bình thường",
  good: "Hài lòng",
  perfect: "Tuyệt vời",
};

// Loại Thực đơn
export const MenuTypeValue = {
  ala_carte: "Gọi tự do",
  buffet: "Gọi buffet",
};

// Trạng thái Phiếu gọi món
export const OrderSheetStatusValue = {
  pending: "Đang chờ xác nhận",
  cancelled: "Đã huỷ phiếu",
  confirmed: "Đang làm món",
  serviced: "Đã phục vụ",
};

// Trạng thái Hoá đơn
export const BillStatusValue = {
  pending: "Đang chờ xác nhận",
  cancelled: "Đã huỷ đơn",
  confirmed: "Đã xác nhận",
};

// Trạng thái thanh toán Hoá đơn
export const BillPaymentStatusValue = {
  paid: "Đã thanh toán",
  unpaid: "Chưa thanh toán",
};

// Trạng thái Đơn đặt bàn
export const ReservationStatusValue = {
  pending: "Đang chờ xác nhận",
  cancelled: "Đã huỷ đơn",
  confirmed: "Đã xác nhận",
};

// Loại phụ thu Loại bàn ăn
export const CategoryTableSurchargeTypeValue = {
  fixed: "Tiền cố định",
  percent: "Phần trăm tiền món ăn",
};

// Trạng thái thanh toán Phiếu nhập
export const InputTicketPaymentStatusValue = {
  paid: "Đã thanh toán",
  unpaid: "Chưa thanh toán",
};

// Trạng thái Phiếu nhập
export const InputTicketStatusValue = {
  pending: "Đang chờ xác nhận",
  cancelled: "Đã huỷ phiếu",
  confirmed: "Đã nhập hàng",
};

// Đơn vị Nguyên liệu
export const IngredientUnitValues = [
  "mg",
  "g",
  "Lạng",
  "kg",
  "ml",
  "l",
  "Muỗng cà phê",
  "Muỗng canh",
  "Cái",
  "Quả",
  "Miếng",
  "Lát",
  "Cây",
  "Bó",
  "Tép",
  "Nhánh",
  "Viên",
  "Gói",
  "Hộp",
  "Lon",
  "Chai",
];

// Đơn vị Món ăn
export const FoodUnitValues = [
  "Phần",
  "Suất",
  "Dĩa",
  "Tô",
  "Bát",
  "Chén",
  "Nồi",
  "Đĩa",
  "Thố",
  "Khẩu phần",
  "Set",
  "Combo",
  "Món",
];

// Trạng thái Món ăn
export const FoodStatusValue = {
  active: "Đang bán",
  inactive: "Dừng bán",
};

// Trạng thái nguyên liệu Món ăn
export const FoodIngredientStatusValue = {
  sufficient: "Đủ nguyên liệu",
  insufficient: "Thiếu nguyên liệu",
};

// Cách tính lương Chức vụ
export const RoleSalaryTypeValue = {
  fixed: "Lương cố định",
  hours: "Lương theo giờ",
};

// Trạng thái Nhân viên
export const EmployeeStatusValue = {
  active: "Đang làm",
  inactive: "Nghỉ làm",
};

// Các giá trị cho Phương thức thanh toán
// - Thông tin tài khoản ngân hàng
export const PaymentMethodAtmInfoValue = {
  atmBank: "MB Bank",
  atmIdCard: "0123456789000000",
  atmFullname: "TRAN THANH QUY",
  atmQRCodeUrl: "123123123",
  mbbankLogo: "mbbank-logo.png",
};
// - Hình ảnh phương thức
export const PaymentMethodImageValue = {
  savingImage: "saving-image.png",
  moneyImage: "money-image.png",
  atmLogo: "atm-logo.png",
  visaMasterJcbLogo: "visa-master-jcb-logo.png",
  momoLogo: "momo-logo.png",
  zalopayLogo: "zalopay-logo.png",
  vnpayLogo: "vnpay-logo.png",
};
// - Tiêu đề phương thức
export const PaymentMethodTitleValue = {
  moneyTitle: "Thanh toán bằng tiền mặt",
  atmTitle: "Thanh toán bằng ngân hàng",
  visMasterJcbTitle: "Thanh toán bằng Visa/Master/JCB",
  momoTitle: "Thanh toán bằng ví MoMo",
  zalopayTitle: "Thanh toán bằng ví ZaloPay",
  vnpayTitle: "Thanh toán bằng ví VNPay",
};

// Các giá trị cho đánh giá Thanh toán POS
// - Id
export const PaymentMachineIdValue = {
  foodScore: "FOOD",
  speedScore: "SPEED",
  employeeScore: "EMPLOYEE",
  serviceScore: "SERVICE",
  placeScore: "PLACE",
};
// - Icon
export const PaymentMachineIconValue = {
  billChecked: "bill-checked-icon.png",
  terribleEmotion: "terrible-emotion.png",
  poorEmotion: "poor-emotion.png",
  okayEmotion: "okay-emotion.png",
  goodEmotion: "good-emotion.png",
  perfectEmotion: "perfect-emotion.png",
};
