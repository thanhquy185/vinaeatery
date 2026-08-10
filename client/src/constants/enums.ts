// Kiểu chung cho Mốc thời gian Thống kê
export type TimelineEnum = "Theo năm" | "Theo quý" | "Theo tháng";

// Loại cho Thống kê Doanh thu
export type RevenueTypeEnum = "Hoá đơn" | "Món ăn" | "Bàn ăn";

// Key cho Thống kê Doanh thu
export type RevenueSegmentKey = "bill" | "food" | "table";

// Loại cho Thống kê Chi tiêu
export type ExpenseTypeEnum = "Phiếu nhập" | "Nguyên liệu" | "Nhà cung cấp";

// Key cho Thống kê Chi tiêu
export type ExpenseSegmentKey = "input-ticket" | "ingredient" | "supplier";

// Trạng thái chung cho nhiều đối tượng
export type CommonStatusEnum = "Hoạt động" | "Tạm dừng";

// Giới tính chung cho nhiều đối tượng
export type CommonGenderEnum = "Nam" | "Nữ";

// Quyền tài khoản Người dùng
export type UserRoleEnum =
  | "Quản trị hệ thống"
  | "Chủ nhà hàng"
  | "Nhân viên nhà hàng"
  | "Khách hàng";

// Phương thức tạo tài khoản Người dùng
export type UserMethodEnum =
  | "Tạo tài khoản thủ công"
  | "Tạo tài khoản bằng Google"
  | "Tạo tài khoản bằng Facebook";

// Trạng thái Thanh toán POS
export type PaymentMachineStatusEnum =
  | "Đang xử lý"
  | "Đã huỷ bỏ"
  | "Đã hoàn thành";

// Trạng thái xử lý Thanh toán POS
export type PaymentMachineProcessStatusEnum =
  | "Đang chọn phương thức thanh toán"
  | "Huỷ thanh toán hoá đơn"
  | "Đã chọn phương thức thanh toán"
  | "Đã hoàn tất thanh toán hoá đơn"
  | "Đã hoàn tất đánh giá cửa hàng";

// Trạng thái Sử dụng bàn ăn
export type UseTableStatusEnum =
  | "Đang bảo trì"
  | "Đang trống"
  | "Đã đặt bàn"
  | "Đang có khách";

// Trải nghiệm Đánh giá
export type FeedbackExperienceEnum =
  | "Dở tệ"
  | "Không hài lòng"
  | "Bình thường"
  | "Hài lòng"
  | "Tuyệt vời";

// Trạng thái Sử dụng món ăn
export type UseFoodStatusEnum = "Còn phục vụ" | "Hết phục vụ";

// Loại Thực đơn
export type MenuTypeEnum = "Gọi tự do" | "Gọi buffet";

// Trạng thái Phiếu gọi món
export type OrderSheetStatusEnum =
  | "Đang chờ xác nhận"
  | "Đã huỷ phiếu"
  | "Đang làm món"
  | "Đã phục vụ";

// Trạng thái Hoá đơn
export type BillStatusEnum = "Đang chờ xác nhận" | "Đã huỷ đơn" | "Đã xác nhận";

// Trạng thái thanh toán Hoá đơn
export type BillPaymentStatusEnum = "Đã thanh toán" | "Chưa thanh toán";

// Trạng thái Đơn đặt bàn
export type ReservationStatusEnum =
  | "Đang chờ xác nhận"
  | "Đã huỷ đơn"
  | "Đã xác nhận";

// Loại phụ thu Loại bàn ăn
export type CategoryTableSurchargeTypeEnum =
  | "Tiền cố định"
  | "Phần trăm tiền món ăn";

// Trạng thái Phiếu nhập
export type InputTicketStatusEnum =
  | "Đang chờ xác nhận"
  | "Đã huỷ phiếu"
  | "Đã nhập hàng";

// Trạng thái thanh toán Phiếu nhập
export type InputTicketPaymentStatusEnum = "Đã thanh toán" | "Chưa thanh toán";

// Đơn vị Nguyên liệu
export type IngredientUnitEnum =
  | "mg"
  | "g"
  | "Lạng"
  | "kg"
  | "ml"
  | "l"
  | "Muỗng cà phê"
  | "Muỗng canh"
  | "Cái"
  | "Quả"
  | "Miếng"
  | "Lát"
  | "Cây"
  | "Bó"
  | "Tép"
  | "Nhánh"
  | "Viên"
  | "Gói"
  | "Hộp"
  | "Lon"
  | "Chai";

// Đơn vị món ăn
export type FoodUnitEnum =
  | "Phần"
  | "Suất"
  | "Dĩa"
  | "Tô"
  | "Bát"
  | "Chén"
  | "Nồi"
  | "Đĩa"
  | "Thố"
  | "Khẩu phần"
  | "Set"
  | "Combo"
  | "Món";

// Trạng thái Món ăn
export type FoodStatusEnum = "Đang bán" | "Dừng bán";

// Cách tính lương Chức vụ
export type RoleSalaryTypeEnum = "Lương cố định" | "Lương theo giờ";

// Trạng thái Nhân viên
export type EmployeeStatusEnum = "Đang làm" | "Nghỉ làm";
