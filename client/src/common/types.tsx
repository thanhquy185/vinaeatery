import type { RcFile } from "antd/es/upload";

// Kiểu dữ liệu của rest response từ server
export interface RestResponseType {
  userLogin: UserType;
  status: number;
  error: string;
  message: string;
  data: { field: string; message: string }[];
}

// Kiểu dữ liệu Chức năng
export interface FunctionType {
  id?: number;
  nameVN?: string;
  nameEN?: string;
  category?: string;
  actions?: string;
}

// Kiểu dữ liệu Người dùng
export interface UserType {
  id?: number;
  createAt?: string;
  role?:
    | "Quản trị hệ thống"
    | "Chủ nhà hàng"
    | "Nhân viên nhà hàng"
    | "Khách hàng";
  username?: string;
  password?: string;
  method?: string;
  isUsing?: string;
  status?: string;
  updateAt?: string;
  newPassword?: string;
  authNewPassword?: string;
}

// Kiểu dữ liệu Phương thức thanh toán
export interface PayMethodType {
  id?: number;
  image?: string;
  name?: string;
}

// Kiểu dữ liệu của tham số với Giỏ hàng khi gọi món
export interface ShoppingCartType {
  food?: FoodType;
  quantity?: number;
}

// Kiểu dữ liệu Xử lý thanh toán
export interface HandlePaymentType {
  id?: number;
  useTableId?: number;
  useTable?: UseTableType;
  employeeId?: number;
  employee?: EmployeeType;
  payMethodId?: number;
  payMethod?: PayMethodType;
  isEmployeeHandle?: boolean;
  payTotalPrice?: number;
  status?: string;
}

// Kiểu dữ liệu Nhà hàng
export interface RestaurantType {
  id?: number;
  managerId?: number;
  manager?: ManagerType;
  restaurantImages?: RestaurantImageType[];
  restaurantImageFiles?: File[] | RcFile[];
  restaurantFoods?: FoodType[];
  createAt?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  rating?: number;
  status?: string;
  updateAt?: string;
  numberOfEmployees?: number;
  numberOfFoods?: number;
}

// Kiểu dữ liệu Ảnh nhà hàng
export interface RestaurantImageType {
  restaurantId?: number;
  image?: string;
  order?: number;
}

// Kiểu dữ liệu Chủ nhà hàng
export interface ManagerType {
  id?: number;
  userId?: number;
  user?: UserType;
  createAt?: string;
  image?: File | RcFile | string;
  fullname?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Khách hàng
export interface CustomerType {
  id?: number;
  userId?: number;
  user?: UserType;
  createAt?: string;
  image?: File | RcFile | string;
  fullname?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Sử dụng bàn ăn
export interface UseTableType {
  id?: number;
  restaurantId?: number;
  timeStart?: string;
  timeEnd?: string;
  tableId?: number;
  table?: TableType;
  employeeId?: number;
  employee?: EmployeeType;
  customerId?: number;
  customer?: CustomerType;
  customerFullname?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderId?: number;
  order?: OrderType;
  orderTableId?: number;
  orderTable?: OrderTableType;
  orderTableNewFullname?: string;
  orderTableNewPhone?: string;
  orderTableNewEmail?: string;
  orderTableNewAddress?: string;
  status?: string;
  orderSheets?: OrderSheetType[];
  message?: MessageType;
}

// Kiểu dữ liệu Sử dụng món ăn
export interface UseFoodType {
  id?: number;
  restaurantId?: number;
  timeStart?: string;
  timeEnd?: string;
  employeeId?: number;
  employee?: EmployeeType;
  foodId?: number;
  food?: FoodType;
  status?: string;
}

// Kiểu dữ liệu Phiếu gọi món
export interface OrderSheetType {
  id?: number;
  restaurantId?: number;
  createAt?: string;
  serviceAt?: string;
  employeeId?: number;
  employee?: EmployeeType;
  tableId?: number;
  table?: TableType;
  totalPrice?: number;
  note?: string;
  message?: string;
  status?: string;
  orderSheetDetails?: OrderSheetDetailType[];
}

// Kiểu dữ liệu Chi tiết phiếu gọi món
export interface OrderSheetDetailType {
  foodId?: number;
  food?: FoodType;
  price: number;
  quantity: number;
}

// Kiểu dữ liệu Tin nhắn
export interface MessageType {
  id?: number;
  restaurantId?: number;
  useTableId?: number;
  useTable?: UseTableType;
  isRead?: boolean;
  messageDetails?: MessageDetailType[];
}

// Kiểu dữ liệu Chi tiết tin nhắn
export interface MessageDetailType {
  messageId?: number;
  sendAt?: string;
  isAdminSend?: boolean;
  content?: string;
}

// Kiểu dữ liệu Đơn món ăn
export interface OrderType {
  id?: number;
  restaurantId?: number;
  createAt?: string;
  employeeId?: number;
  employee?: EmployeeType;
  customerId?: number;
  customer?: CustomerType;
  customerFullname?: string;
  customerPhone?: string;
  customerEmail?: string;
  totalPrice?: number;
  status?: string;
  payId?: string;
  payMethodId?: number;
  payMethod?: PayMethodType;
  payTime?: string;
  payTotalPrice?: number;
  payStatus?: string;
  orderDetails?: OrderDetailType[];
}

// Kiểu dữ liệu Chi tiết đơn món ăn
export interface OrderDetailType {
  foodId?: number;
  food: FoodType;
  price: number;
  quantity: number;
}

// Kiểu dữ liệu Đơn đặt bàn
export interface OrderTableType {
  id?: number;
  restaurantId?: number;
  restaurant?: RestaurantType;
  createAt?: string;
  arriveAt?: string;
  employeeId?: number;
  employee?: EmployeeType;
  customerId?: number;
  customer?: CustomerType;
  customerFullname?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerNote?: string;
  guests?: number;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Tầng
export interface FloorType {
  id?: number;
  restaurantId?: number;
  name?: string;
  description?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Loại bàn ăn
export interface CategoryTableType {
  id?: number;
  restaurantId?: number;
  name?: string;
  surchargeType?: string;
  surchargeValue?: number;
  description?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Bàn ăn
export interface TableType {
  id?: number;
  restaurantId?: number;
  name?: string;
  categoryTableId?: number;
  categoryTable?: CategoryTableType;
  floorId?: number;
  floor?: FloorType;
  seats?: number;
  description?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Phiếu nhập
export interface InputTicketType {
  id?: number;
  restaurantId?: number;
  createAt?: string;
  supplierId?: number;
  supplier?: SupplierType;
  employeeId?: number;
  employee?: EmployeeType;
  totalPrice?: number;
  payStatus?: string;
  status?: string;
  inputTicketDetails?: InputTicketDetailType[];
}

// Kiểu dữ liệu Chi tiết phiếu nhập
export interface InputTicketDetailType {
  ingredientId?: number;
  ingredient?: IngredientType;
  price?: number;
  quantity?: number;
}

// Kiểu dữ liệu Nhà cung cấp
export interface SupplierType {
  id?: number;
  restaurantId?: number;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Loại nguyên liệu
export interface CategoryIngredientType {
  id?: number;
  restaurantId?: number;
  name?: string;
  description?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Nguyên liệu
export interface IngredientType {
  id?: number;
  restaurantId?: number;
  name?: string;
  categoryIngredientId?: number;
  categoryIngredient?: CategoryIngredientType;
  unit?: string;
  capacity?: number;
  dateCreate?: string;
  dateRemove?: string;
  inputPrice?: number;
  inventory?: number;
  note?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Loại món ăn
export interface CategoryFoodType {
  id?: number;
  restaurantId?: number;
  image?: string | File | RcFile;
  name?: string;
  description?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Món ăn
export interface FoodType {
  id?: number;
  restaurantId?: number;
  image?: string | File | RcFile;
  name?: string;
  categoryFoodId?: number;
  categoryFood?: CategoryFoodType;
  unit?: string;
  price?: number;
  description?: string;
  status?: string;
  updateAt?: string;
  recipe?: RecipeType[];
}

// Kiểu dữ liệu Công thức món ăn
export interface RecipeType {
  foodId?: number;
  ingredientId?: number;
  ingredientName?: string;
  ingredientInventory?: number;
  quantity?: number;
  note?: string;
}

// Kiểu dữ liệu Bảng lương
export interface PayslipType {
  employee?: EmployeeType;
  schedules?: ScheduleType[];
  attendances?: AttendanceType[];
  rewardPunishes?: RewardPunishType[];
}
// -
export interface PayslipMonth {
  month: string;
  totalTime: number;
  totalSalary: number;
  totalStatus: string;
  payslipDates: PayslipDate[];
}
export interface PayslipDate {
  date: string;
  employee: EmployeeType;
  attendanceTime: number;
  attendanceSalary: number;
  totalTime: number;
  totalSalary?: number;
  status: string;
  payslipShifts: PayslipShiftType[];
}
export interface PayslipAttendanceDate {
  date: string;
  employee: EmployeeType;
  payslipShifts: PayslipShiftType[];
}
export interface PayslipShiftType {
  id: number;
  name: string;
  time: number;
  status: string;
}

// Kiểu dữ liễu Bảng điểm danh
export interface AttendanceTableType {
  employee?: EmployeeType;
  schedules?: ScheduleType[];
  attendances?: AttendanceType[];
}

// Kiểu dữ liệu Điểm danh
export interface AttendanceType {
  id?: number;
  restaurantId?: number;
  employeeId?: number;
  employee?: EmployeeType;
  shiftId?: number;
  shift?: ShiftType;
  date?: string;
  checkIn?: string;
  checkOut?: string;
  leave?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Lịch làm
export interface ScheduleType {
  id?: number;
  restaurantId?: number;
  name?: string;
  dateStart?: string;
  dateEnd?: string;
  note?: string;
  status?: string;
  updateAt?: string;
  scheduleEmployees?: ScheduleEmployeeType[];
  scheduleShifts?: ScheduleShiftType[];
  // scheduleExceptions?: ScheduleExceptionType[];
}

export interface ScheduleEmployeeType {
  scheduleId?: number;
  employeeId?: number;
  employee?: EmployeeType;
}

export interface ScheduleShiftType {
  scheduleId?: number;
  shiftId?: number;
  shift?: ShiftType;
}

// export interface ScheduleExceptionType {
//   id?: number;
//   scheduleId: number;
//   date: string;
//   type: "OFF" | "CHANGE_SHIFT";
//   newShiftId?: number;
//   reason?: string;
// }

// Kiểu dữ liệu Ca làm
export interface ShiftType {
  id?: number;
  restaurantId?: number;
  name?: string;
  shiftDetails?: ShiftDetailType[];
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Chi tiết ca làm
export interface ShiftDetailType {
  shiftId?: number;
  dayOfWeek?: number;
  timeStart?: string;
  timeEnd?: string;
}

// Kiểu dữ liệu Lịch sử máy chấm công
export interface MachineLogType {
  id?: number;
  employeeId?: number;
  employee?: EmployeeType;
  time?: string;
  action?: string;
}

// Kiểu dữ liệu Loại đơn xin phép
export interface CategoryPermissionTicketType {
  id?: number;
  restaurantId?: number;
  name?: string;
  description?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Đơn xin phép
export interface PermissionTicketType {
  id?: number;
  restaurantId?: number;
  createAt?: string;
  employeeHandleId?: number;
  employeeHandle?: EmployeeType;
  employeeMainId?: number;
  employeeMain?: EmployeeType;
  categoryPermissionTicketId?: number;
  categoryPermissionTicket?: CategoryPermissionTicketType;
  date?: string;
  reason?: string;
  status?: string;
}

// Kiểu dữ liệu Loại thưởng - phạt
export interface CategoryRewardPunishType {
  id?: number;
  restaurantId?: number;
  name?: string;
  handle?: string;
  description?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu thưởng - phạt
export interface RewardPunishType {
  id?: number;
  restaurantId?: number;
  createAt?: string;
  employeeHandleId?: number;
  employeeHandle?: EmployeeType;
  employeeMainId?: number;
  employeeMain?: EmployeeType;
  categoryRewardPunishId?: number;
  categoryRewardPunish?: CategoryRewardPunishType;
  date?: string;
  money?: number;
  reason?: string;
  status?: string;
  updateAt?: string;
}

// // Kiểu dữ liệu Kế hoạch phúc lợi
// export interface BenefitPlanType {
//   id?: number;
//   restaurantId?: number;
//   name?: string;
//   dateStart?: string;
//   dateEnd?: string;
//   note?: string;
//   status?: string;
//   updateAt?: string;
//   benefitPlanEmployees?: BenefitPlanEmployeeType[];
//   benefitPlanBenefits?: BenefitPlanBenefit[];
// }

// export interface BenefitPlanEmployeeType {
//   benefitPlanId?: number;
//   employeeId?: number;
//   employee?: EmployeeType;
// }

// export interface BenefitPlanBenefit {
//   benefitPlanId?: number;
//   benefitId?: number;
//   benefit?: BenefitType;
//   value?: number;
//   note?: string;
// }

// // Kiểu dữ liệu Phúc lợi
// export interface BenefitType {
//   id?: number;
//   icon?: string;
//   name?: string;
//   type?: string;
//   description?: string;
// }

// Kiểu dữ liệu Chức vụ
export interface RoleType {
  id?: number;
  restaurantId?: number;
  name?: string;
  salaryType?: string;
  salaryValue?: number;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Lịch sử chức vụ
export interface RoleHistoryType {
  employeeId?: number;
  roleId?: number;
  roleName?: string;
  roleSalaryType?: string;
  roleSalaryValue?: number;
  dateStart?: string;
  dateEnd?: string;
}

// Kiểu dữ liệu Quyền hạn
export interface PermissionType {
  id?: number;
  restaurantId?: number;
  name?: string;
  status?: string;
  updateAt?: string;
  permissionDetails?: PermissionDetailType[];
}

// Kiểu dữ liệu Chi tiết quyền hạn
export interface PermissionDetailType {
  permissionId?: number;
  functionId?: number;
  action?: string;
}

// Kiểu dữ liệu Nhân viên
export interface EmployeeType {
  id?: number;
  user?: UserType;
  restaurantId?: number;
  createAt?: string;
  image?: string | File | RcFile;
  fullname?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  roleId?: number;
  currentRole?: RoleType;
  roleHistories?: RoleHistoryType[];
  username?: string;
  password?: string;
  permissionId?: number;
  permission?: PermissionType;
  status?: string;
  updateAt?: string;
  currentPassword?: string;
  newPassword?: string;
  authNewPassword?: string;
}
