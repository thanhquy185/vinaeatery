import type { RcFile } from "antd/es/upload";

// Kiểu dữ liệu của rest response từ backend
export interface RestResponseType {
  employeeLogin: EmployeesFormatType;
  status: number;
  error: string;
  message: string;
  data: { field: string; message: string }[];
}

// Kiểu dữ liệu cho việc thực thi mutation
export interface ReactQueryMutationProps<T> {
  type: "create" | "update" | "lock" | "unlock" | "change-password";
  values?: T;
  objectId?: string | number;
  imageFile?: RcFile;
  details?: any[];
  // totalPrice?: number;
  // details?: OrderDetailsFormatType | InputTicketDetailsFormatType;
}


// Kiểu dữ liệu của tham số với việc lọc dữ liệu
export interface FilterDataProps {
  findType?: string;
  findValue?: string;
  timeValue?: [string, string];
  floorValue?: string[];
  categoryValue?: string[];
  customerCardValue?: string[];
  surchargeTypeValue?: string[];
  roleValue?: string[];
  statusValue?: string[];
}

// Kiểu dữ liệu của tham số với Giỏ hàng khi gọi món
export interface ShoppingCartsType {
  food?: FoodsFormatType;
  quantity?: number;
}

// Kiểu dữ liệu Xử lý thanh toán
// - Chưa format
export interface HandlePaymentsType {
  useTableId?: number;
  employeeId?: number;
  payMethodId?: number;
  payTotalPrice?: number;
  status?: string;
}
// - Đã format
export interface HandlePaymentsFormatType {
  useTable?: UseTablesFormatType;
  employee?: EmployeesFormatType;
  payMethod?: PayMethodsType;
  payTotalPrice?: number;
  status?: string;
}

// Kiểu dữ liệu Sử dụng bàn ăn
// - Chưa format
export interface UseTablesType {
  id?: number;
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
  timeStart?: string;
  timeEnd?: string;
  table?: TablesFormatType;
  employee?: EmployeesFormatType;
  customer?: CustomersFormatType;
  order?: OrdersFormatType;
  orderTable?: OrderTablesFormatType;
  status?: string;
  orderSheets?: OrderSheetsFormatType[];
}

// Kiểu dữ liệu Phiếu gọi món
// - Chưa format
export interface OrderSheetsType {
  id?: number;
  timeCreate?: string;
  timeService?: string;
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
  timeCreate?: string;
  timeService?: string;
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

// Kiểu dữ liệu Phương thức thanh toán
export interface PayMethodsType {
  id?: number;
  image?: string;
  name?: string;
}

// Kiểu dữ liệu Đơn món ăn
// - Chưa format
export interface OrdersType {
  id?: number;
  timeCreate?: string;
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
  timeCreate?: string;
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
  timeOrder?: string;
  timeArrive?: string;
  employeeId?: number;
  fullname?: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
  status?: string;
  timeUpdate?: string;
}
// - Đã format
export interface OrderTablesFormatType {
  id?: number;
  timeOrder?: string;
  timeArrive?: string;
  employee?: EmployeesFormatType;
  fullname?: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
  status?: string;
  timeUpdate?: string;
}

// Kiểu dữ liệu Thẻ khách hàng
export interface CustomerCardsType {
  id?: number;
  image?: string | RcFile;
  name?: string;
  threshold?: number;
  discount?: number;
  description?: string;
  status?: string;
  timeUpdate?: string;
}

// Kiểu dữ liệu Khách hàng
// - Chưa format
export interface CustomersType {
  id?: number;
  customerCardId?: number;
  totalThreshold?: number;
  fullname?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  status?: string;
  timeUpdate?: string;
}
// - Đã format
export interface CustomersFormatType {
  id?: number;
  customerCard?: CustomerCardsType;
  totalThreshold?: number;
  fullname?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  status?: string;
  timeUpdate?: string;
}

// Kiểu dữ liệu Tầng
export interface FloorsType {
  id?: number;
  name?: string;
  description?: string;
  status?: string;
  timeUpdate?: string;
}

// Kiểu dữ liệu Loại bàn ăn
export interface CategoryTablesType {
  id?: number;
  name?: string;
  surchargeType?: string;
  surchargeValue?: number;
  description?: string;
  status?: string;
  timeUpdate?: string;
}

// Kiểu dữ liệu Bàn ăn
// - Chưa format
export interface TablesType {
  id?: number;
  name?: string;
  categoryTableId?: number;
  floorId?: number;
  seats?: number;
  description?: string;
  status?: string;
  timeUpdate?: string;
}
// - Đã format
export interface TablesFormatType {
  id?: number;
  name?: string;
  categoryTable?: CategoryTablesType;
  floor?: FloorsType;
  seats?: number;
  description?: string;
  status?: string;
  timeUpdate?: string;
}

// Kiểu dữ liệu Phiếu nhập
// - Chưa format
export interface InputTicketsType {
  id?: number;
  timeCreate?: string;
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
  timeCreate?: string;
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
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
  timeUpdate?: string;
}

// Kiểu dữ liệu Loại nguyên liệu
export interface CategoryIngredientsType {
  id?: number;
  name?: string;
  description?: string;
  status?: string;
  timeUpdate?: string;
}

// Kiểu dữ liệu Nguyên liệu
// - Chưa format
export interface IngredientsType {
  id?: number;
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
  timeUpdate?: string;
}
// - Đã format
export interface IngredientsFormatType {
  id?: number;
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
  timeUpdate?: string;
}

// Kiểu dữ liệu Loại món ăn
export interface CategoryFoodsType {
  id?: number;
  image?: string | RcFile;
  name?: string;
  description?: string;
  status?: string;
  timeUpdate?: string;
}

// Kiểu dữ liệu Món ăn
// - Chưa format
export interface FoodsType {
  id?: number;
  image?: string | RcFile;
  name?: string;
  categoryFoodId?: number;
  unit?: string;
  price?: number;
  description?: string;
  status?: string;
  timeUpdate?: string;
  recipe?: RecipesType[];
}
// - Đã format
export interface FoodsFormatType {
  id?: number;
  image?: string | RcFile;
  name?: string;
  categoryFood?: CategoryFoodsType;
  unit?: string;
  price?: number;
  description?: string;
  status?: string;
  timeUpdate?: string;
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

// Kiểu dữ liệu Loại thưởng phạt
export interface CategoryRewardPunishesType {
  id: number;
  name?: string;
  handle?: string;
  description?: string;
  status?: string;
  timeUpdate?: string;
}

// Kiểu dữ liệu Thưởng phạt
export interface RewardPunishesType {
  id: number;
  employeeMain?: EmployeesType;
  categoryRewardPunishes?: CategoryRewardPunishesType;
  date?: string;
  money?: number;
  reason?: string;
  employeeCheck?: EmployeesType;
  status?: string;
  timeUpdate?: string;
}

// Kiểu dữ liệu Ca làm việc
export interface ShiftsType {
  id: number;
  name?: string;
  timeStart?: string;
  timeEnd?: string;
  status?: string;
  timeUpdate?: string;
  shiftDetails?: Object[];
}

// Kiểu dữ liệu Chức vụ
// - Chưa format
export interface RolesType {
  id?: number;
  name?: string;
  salary?: number;
  status?: string;
  timeUpdate?: string;
  roleDetails?: RoleDetailsType[];
}
// - Đã format
export interface RolesFormatType {
  id?: number;
  name?: string;
  salary?: number;
  status?: string;
  timeUpdate?: string;
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
  image?: string | RcFile;
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
  timeUpdate?: string;
  currentPassword?: string;
  newPassword?: string;
  authNewPassword?: string;
}
// - Đã format
export interface EmployeesFormatType {
  id?: number;
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
  username?: string;
  password?: string;
  status?: string;
  timeUpdate?: string;
}

export interface FunctionsType {
  id?: number;
  nameVN?: string;
  nameEN?: string;
  category?: string;
  actions?: string;
}
