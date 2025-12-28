import type { RcFile } from "antd/es/upload";

// Kiểu dữ liệu của rest response từ backend
export interface RestResponseType {
  userLogin: UsersType;
  status: number;
  error: string;
  message: string;
  data: { field: string; message: string }[];
}

// Kiểu dữ liệu người dùng
export interface UsersType {
  id?: number;
  createAt?: string;
  role?: "Quản trị hệ thống" | "Chủ nhà hàng" | "Nhân viên nhà hàng" | "Khách hàng";
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
export interface PayMethodsType {
  id?: number;
  image?: string;
  name?: string;
}

// Kiểu dữ liệu của tham số với Giỏ hàng khi gọi món
export interface ShoppingCartsType {
  food?: FoodsFormatType;
  quantity?: number;
}

// Kiểu dữ liệu Xử lý thanh toán
// - Chưa format
export interface HandlePaymentsType {
  id?: number;
  useTableId?: number;
  employeeId?: number;
  payMethodId?: number;
  payTotalPrice?: number;
  status?: string;
}
// - Đã format
export interface HandlePaymentsFormatType {
  id?: number;
  useTable?: UseTablesFormatType;
  employee?: EmployeesFormatType;
  payMethod?: PayMethodsType;
  payTotalPrice?: number;
  status?: string;
}

// Kiểu dữ liệu Nhà hàng
// - Chưa format
export interface RestaurantsType {
  id?: number;
  managerId?: number;
  restaurantImages?: File[] | RcFile[];
  createAt?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  rating?: number;
  status?: string;
  updateAt?: string;
}
// - Đã format
export interface RestaurantsFormatType {
  id?: number;
  manager?: ManagersFormatType;
  restaurantImages?: RestaurantImagesFormatType[];
  restaurantFoods?: FoodsFormatType[];
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
// - Chưa format
export interface RestaurantImagesType {
  restaurantId?: number;
  image?: string;
  order?: number;
}
// - Đã format
export interface RestaurantImagesFormatType {
  image?: string;
  order?: number;
}

// Kiểu dữ liệu Chủ nhà hàng
// - Chưa format
export interface ManagersType {
  id?: number;
  userId?: number;
  createAt?: string;
  image?: File | RcFile |string;
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
// - Đã format
export interface ManagersFormatType {
  id?: number;
  user?: UsersType;
  createAt?: string;
  image?: string;
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
// - Chưa format
export interface CustomersType {
  id?: number;
  userId?: number;
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
// - Đã format
export interface CustomersFormatType {
  id?: number;
  user?: UsersType;
  createAt?: string;
  image?: string;
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

// Kiểu dữ liệu Tin nhắn
// - Chưa format
export interface MessagesType {
  id?: number;
  restaurantId?: number;
  useTableId?: number;
  isRead?: boolean;
  messageDetails?: MessageDetailsType[];
}
// - Đã format
export interface MessagesFormatType {
  id?: number;
  restaurantId?: number;
  useTable?: UseTablesFormatType;
  isRead?: boolean;
  messageDetails?: MessageDetailsFormatType[];
}

// Kiểu dữ liệu Chi tiết tin nhắn
// - Chưa format
export interface MessageDetailsType {
  messageId?: number;
  sendAt?: string;
  isAdminSend?: boolean;
  content?: string;
}
// - Đã format
export interface MessageDetailsFormatType {
  sendAt?: string;
  isAdminSend?: boolean;
  content?: string;
}

// Kiểu dữ liệu Sử dụng bàn ăn
// - Chưa format
export interface UseTablesType {
  id?: number;
  restaurantId?: number;
  timeStart?: string;
  timeEnd?: string;
  tableId?: number;
  employeeId?: number;
  customerId?: number;
  orderId?: number;
  orderTableId?: number;
  orderTableNewFullname?: string;
  orderTableNewPhone?: string;
  orderTableNewEmail?: string;
  orderTableNewAddress?: string;
  status?: string;
  orderSheets?: OrderSheetsFormatType[];
}
// - Đã format
export interface UseTablesFormatType {
  id?: number;
  restaurantId?: number;
  timeStart?: string;
  timeEnd?: string;
  table?: TablesFormatType;
  employee?: EmployeesFormatType;
  customer?: CustomersFormatType;
  order?: OrdersFormatType;
  orderTable?: OrderTablesFormatType;
  status?: string;
  orderSheets?: OrderSheetsFormatType[];
  message?: MessagesFormatType;
}

// Kiểu dữ liệu Sử dụng món ăn
// - Chưa format
export interface UseFoodsType {
  id?: number;
  restaurantId?: number;
  timeStart?: string;
  timeEnd?: string;
  employeeId?: number;
  foodId?: number;
  status?: string;
}
// - Đã format
export interface UseFoodsFormatType {
  id?: number;
  restaurantId?: number;
  timeStart?: string;
  timeEnd?: string;
  employee?: EmployeesFormatType;
  food?: FoodsFormatType;
  status?: string;
}

// Kiểu dữ liệu Phiếu gọi món
// - Chưa format
export interface OrderSheetsType {
  id?: number;
  restaurantId?: number;
  createAt?: string;
  serviceAt?: string;
  employeeId?: number;
  tableId?: number;
  totalPrice?: number;
  note?: string;
  message?: string;
  status?: string;
  orderSheetDetails?: OrderSheetDetailsType[];
}
// - Đã format
export interface OrderSheetsFormatType {
  id?: number;
  restaurantId?: number;
  createAt?: string;
  serviceAt?: string;
  employee?: EmployeesFormatType;
  table?: TablesFormatType;
  totalPrice?: number;
  note?: string;
  message?: string;
  status?: string;
  orderSheetDetails?: OrderSheetDetailsFormatType[];
}

// Kiểu dữ liệu Chi tiết phiếu gọi món
// - Chưa format
export interface OrderSheetDetailsType {
  foodId: number;
  price: number;
  quantity: number;
}
// - Đã format
export interface OrderSheetDetailsFormatType {
  food: FoodsFormatType;
  price: number;
  quantity: number;
}

// Kiểu dữ liệu Đơn món ăn
// - Chưa format
export interface OrdersType {
  id?: number;
  restaurantId?: number;
  createAt?: string;
  employeeId?: number;
  customerId?: number;
  totalPrice?: number;
  status?: string;
  payId?: string;
  payMethodId?: number;
  payTime?: string;
  payTotalPrice?: number;
  payStatus?: string;
  orderDetails?: OrderDetailsType[];
}
// - Đã format
export interface OrdersFormatType {
  id?: number;
  restaurantId?: number;
  createAt?: string;
  employee?: EmployeesFormatType;
  customer?: CustomersFormatType;
  totalPrice?: number;
  status?: string;
  payId?: string;
  payMethod?: PayMethodsType;
  payTime?: string;
  payTotalPrice?: number;
  payStatus?: string;
  orderDetails?: OrderDetailsFormatType[];
}

// Kiểu dữ liệu Chi tiết đơn món ăn
// - Chưa format
export interface OrderDetailsType {
  foodId: number;
  price: number;
  quantity: number;
}
// - Đã format
export interface OrderDetailsFormatType {
  food: FoodsType;
  price: number;
  quantity: number;
}

// Kiểu dữ liệu Đơn đặt bàn
// - Chưa format
export interface OrderTablesType {
  id?: number;
  restaurantId?: number;
  employeeId?: number;
  customerId?: number;
  createAt?: string;
  arriveAt?: string;
  customerFullname?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerNote?: string;
  guests?: number;
  status?: string;
  updateAt?: string;
}
// - Đã format
export interface OrderTablesFormatType {
  id?: number;
  restaurantId?: number;
  restaurant?: RestaurantsFormatType;
  employee?: EmployeesFormatType;
  customer?: CustomersFormatType;
  createAt?: string;
  arriveAt?: string;
  customerFullname?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerNote?: string;
  guests?: number;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Thẻ khách hàng
export interface CustomerCardsType {
  id?: number;
  restaurantId?: number;
  image?: string | File | RcFile;
  name?: string;
  threshold?: number;
  discount?: number;
  description?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Tầng
export interface FloorsType {
  id?: number;
  restaurantId?: number;
  name?: string;
  description?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Loại bàn ăn
export interface CategoryTablesType {
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
// - Chưa format
export interface TablesType {
  id?: number;
  restaurantId?: number;
  name?: string;
  categoryTableId?: number;
  floorId?: number;
  seats?: number;
  description?: string;
  status?: string;
  updateAt?: string;
}
// - Đã format
export interface TablesFormatType {
  id?: number;
  restaurantId?: number;
  name?: string;
  categoryTable?: CategoryTablesType;
  floor?: FloorsType;
  seats?: number;
  description?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Phiếu nhập
// - Chưa format
export interface InputTicketsType {
  id?: number;
  restaurantId?: number;
  createAt?: string;
  supplierId?: number;
  employeeId?: number;
  totalPrice?: number;
  payStatus?: string;
  status?: string;
  inputTicketDetails?: InputTicketDetailsType[];
}
// - Đã format
export interface InputTicketsFormatType {
  id?: number;
  restaurantId?: number;
  createAt?: string;
  supplier?: SuppliersType;
  employee?: EmployeesType;
  totalPrice?: number;
  payStatus?: string;
  status?: string;
  inputTicketDetails?: InputTicketDetailsFormatType[];
}

// Kiểu dữ liệu Chi tiết phiếu nhập
// - Chưa format
export interface InputTicketDetailsType {
  ingredientId: number;
  price: number;
  quantity: number;
}
// - Đã format
export interface InputTicketDetailsFormatType {
  ingredient: IngredientsFormatType;
  price: number;
  quantity: number;
}

// Kiểu dữ liệu Nhà cung cấp
export interface SuppliersType {
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
export interface CategoryIngredientsType {
  id?: number;
  restaurantId?: number;
  name?: string;
  description?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Nguyên liệu
// - Chưa format
export interface IngredientsType {
  id?: number;
  restaurantId?: number;
  name?: string;
  categoryIngredientId?: number;
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
// - Đã format
export interface IngredientsFormatType {
  id?: number;
  restaurantId?: number;
  name?: string;
  categoryIngredient?: CategoryIngredientsType;
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
// - Chưa format
export interface CategoryFoodsType {
  id?: number;
  restaurantId?: number;
  image?: string | File | RcFile;
  name?: string;
  description?: string;
  status?: string;
  updateAt?: string;
}

// Kiểu dữ liệu Món ăn
// - Chưa format
export interface FoodsType {
  id?: number;
  restaurantId?: number;
  image?: string | File | RcFile;
  name?: string;
  categoryFoodId?: number;
  unit?: string;
  price?: number;
  description?: string;
  status?: string;
  updateAt?: string;
  recipe?: RecipesType[];
}
// - Đã format
export interface FoodsFormatType {
  id?: number;
  restaurantId?: number;
  image?: string | File | RcFile;
  name?: string;
  categoryFood?: CategoryFoodsType;
  unit?: string;
  price?: number;
  description?: string;
  status?: string;
  updateAt?: string;
  recipe?: RecipesFormatType[];
}

// Kiểu dữ liệu Công thức
// - Chưa format
export interface RecipesType {
  foodId?: number;
  ingredientId?: number;
  quantity?: number;
  note?: string;
}
// - Đã format
export interface RecipesFormatType {
  ingredientId?: number;
  ingredientName?: string;
  ingredientInventory?: number;
  quantity?: number;
  note?: string;
}

// // Kiểu dữ liệu Loại thưởng phạt
// export interface CategoryRewardPunishesType {
//   id: number;
//   name?: string;
//   handle?: string;
//   description?: string;
//   status?: string;
//   updateAt?: string;
// }

// // Kiểu dữ liệu Thưởng phạt
// export interface RewardPunishesType {
//   id: number;
//   employeeMain?: EmployeesType;
//   categoryRewardPunishes?: CategoryRewardPunishesType;
//   date?: string;
//   money?: number;
//   reason?: string;
//   employeeCheck?: EmployeesType;
//   status?: string;
//   updateAt?: string;
// }

// // Kiểu dữ liệu Ca làm việc
// export interface ShiftsType {
//   id: number;
//   name?: string;
//   timeStart?: string;
//   timeEnd?: string;
//   status?: string;
//   updateAt?: string;
//   shiftDetails?: Object[];
// }

// Kiểu dữ liệu Chức vụ
// - Chưa format
export interface RolesType {
  id?: number;
  restaurantId?: number;
  name?: string;
  salary?: number;
  status?: string;
  updateAt?: string;
  roleDetails?: RoleDetailsType[];
}
// - Đã format
export interface RolesFormatType {
  id?: number;
  restaurantId?: number;
  name?: string;
  salary?: number;
  status?: string;
  updateAt?: string;
  roleDetails?: RoleDetailsFormatType[];
}

// Kiểu dữ liệu Chi tiết chức vụ
// - Chưa format
export interface RoleDetailsType {
  functionId?: number;
  action?: string;
}
// - Đã format
export interface RoleDetailsFormatType {
  roleId?: number;
  functionId?: number;
  action?: string;
}

// Kiểu dữ liệu Lịch sử chức vụ
// - Chưa format
export interface RoleHistoriesType {
  employeeId?: number;
  roleId?: number;
  dateBegin?: string;
}
// - Đã format
export interface RoleHistoriesFormatType {
  employeeId?: number;
  roleId?: number;
  dateBegin?: string;
  dateEnd?: string;
}

// Kiểu dữ liệu Nhân viên
// - Chưa format
export interface EmployeesType {
  id?: number;
  restaurantId?: number;
  createAt?: string;
  image?: string | File | RcFile;
  fullname?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  dateBegin?: string;
  dateEnd?: string;
  roleId?: number;
  username?: string;
  password?: string;
  status?: string;
  updateAt?: string;
  currentPassword?: string;
  newPassword?: string;
  authNewPassword?: string;
}
// - Đã format
export interface EmployeesFormatType {
  id?: number;
  user?: UsersType;
  restaurantId?: number;
  createAt?: string;
  image?: string;
  fullname?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  dateBegin?: string;
  dateEnd?: string;
  currentRole?: RolesType;
  roleHistories?: RoleHistoriesFormatType[];
  status?: string;
  updateAt?: string;
}

export interface FunctionsType {
  id?: number;
  nameVN?: string;
  nameEN?: string;
  category?: string;
  actions?: string;
}
