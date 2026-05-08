// Các key tương ứng cho từng đối tượng
export const keys = {
  auth: "auth",
  momo: "momo",
  zalopay: "zalopay",
  messages: "messages",
  functions: "functions",
  payMethods: "pay-methods",
  handlePayments: "handle-payments",
  users: "users",
  restaurants: "restaurants",
  managers: "managers",
  customers: "customers",
  useTables: "use-tables",
  useFoods: "use-foods",
  orderSheets: "order-sheets",
  orderTables: "order-tables",
  orders: "orders",
  floors: "floors",
  categoryTables: "category-tables",
  tables: "tables",
  inputTickets: "input-tickets",
  suppliers: "suppliers",
  categoryIngredients: "category-ingredients",
  ingredients: "ingredients",
  categoryFoods: "category-foods",
  foods: "foods",
  attendances: "attendances",
  categoryAllowances: "category-allowances",
  allowances: "allowances",
  categoryInsurances: "category-insurances",
  insurances: "insurances",
  salaryAdvances: "salary-advances",
  categoryPermissionTickets: "category-permission-tickets",
  permissionTickets: "permission-tickets",
  categoryRewardPunishes: "category-reward-punishes",
  rewardPunishes: "reward-punishes",
  schedules: "schedules",
  shifts: "shifts",
  roles: "roles",
  permissions: "permissions",
  permissionDetails: "permission-details",
  employees: "employees",
};
// Form bảo mật chung để truy vấn dữ liệu (bảo mật)
export const formSecurityValue = {
  project: {
    name: "vinaeatery",
    dateCreate: "2025-06-01",
    clientWeb: "react.js",
    server: "spring-boot",
  },
  developer: {
    fullname: "tranthanhquy",
    phone: "0923073724",
    email: "thanhquyfu@gmail.com",
  },
};
// Hàm tạo form bảo mật mới tương ứng với đối tượng
export const getNewFormSecurityValue = ({
  fieldName,
  fieldAction,
}: {
  fieldName: string;
  fieldAction: string;
}) => {
  return {
    ...formSecurityValue,
    field: { name: fieldName, action: fieldAction },
  };
};
