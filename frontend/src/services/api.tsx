import type { AxiosResponse } from "axios";
import instance from "./customize";
import type {
  CategoryFoodsType,
  CategoryIngredientsType,
  CategoryTablesType,
  CustomerCardsType,
  CustomersFormatType,
  CustomersType,
  EmployeesFormatType,
  EmployeesType,
  FilterDataProps,
  FloorsType,
  FoodsFormatType,
  FoodsType,
  FunctionsType,
  IngredientsFormatType,
  IngredientsType,
  InputTicketsFormatType,
  InputTicketsType,
  OrdersFormatType,
  OrderSheetsFormatType,
  OrderSheetsType,
  OrdersType,
  OrderTablesFormatType,
  OrderTablesType,
  RestResponseType,
  RolesFormatType,
  RolesType,
  SuppliersType,
  TablesFormatType,
  TablesType,
  UseTablesFormatType,
  UseTablesType,
} from "../common/types";

// Các key tương ứng cho từng đối tượng
const keys = {
  auth: "auth",
  categoryFoods: "category-foods",
  categoryIngredients: "category-ingredients",
  categoryTables: "category-tables",
  customers: "customers",
  customerCards: "customer-cards",
  employees: "employees",
  floors: "floors",
  foods: "foods",
  functions: "functions",
  ingredients: "ingredients",
  inputTickets: "input-tickets",
  orders: "orders",
  orderSheets: "order-sheets",
  orderTables: "order-tables",
  roles: "roles",
  roleDetails: "role-details",
  suppliers: "suppliers",
  tables: "tables",
  useTables: "use-tables",
}
// Form bảo mật chung để truy vấn dữ liệu (bảo mật)
const formSecurityValue = {
  project: {
    name: "vinaeatery",
    dateCreate: "2025-06-01",
    frontend: "react.js",
    backend: "spring-boot",
  },
  developer: {
    fullname: "tranthanhquy",
    phone: "0923073724",
    email: "thanhquyfu@gmail.com"
  }
}
// Hàm tạo form bảo mật mới tương ứng với đối tượng
const getNewFormSecurityValue = ({ fieldName, fieldAction }: { fieldName: string, fieldAction: string }) => {
  return { ...formSecurityValue, field: { name: fieldName, action: fieldAction } };
}

// Các api của đối tượng xác thực (Auth)
export const HandleLogin = (
  {
    username,
    password
  }: { username: string, password: string }
): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.auth, fieldAction: "login" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "account",
    new Blob(
      [
        JSON.stringify({
          username,
          password
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(`/api/${keys.auth}/login`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLogout = (): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.post(
    `/api/${keys.auth}/logout`,
    getNewFormSecurityValue({ fieldName: keys.auth, fieldAction: "logout" })
  );
}
export const HandleAccount = (): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.post(
    `/api/${keys.auth}/account`,
    getNewFormSecurityValue({ fieldName: keys.auth, fieldAction: "account" })
  );
}

// Các api của đối tượng Sử dụng bàn ăn (Use Table)
export const FindOneNewUseTableByTableId = ({
  tableId,
}: {
  tableId: string;
}): Promise<AxiosResponse<UseTablesFormatType, any>> => {
  return instance.post(
    `/api/${keys.useTables}/${tableId}`,
    getNewFormSecurityValue({ fieldName: keys.useTables, fieldAction: "read" })
  );
};
export const FindAllUseTable = ({
  findType,
  findValue,
  timeValue,
  floorValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<UseTablesFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "table") params.tableName = findValue!;
  }
  if (timeValue! && timeValue!.length > 0) {
    if (timeValue![0] !== "") params.timeStart = timeValue![0];
    if (timeValue![1] !== "") params.timeEnd = timeValue![1];
  }
  if (floorValue! && floorValue!.length > 0)
    params.floorId = floorValue![0];
  if (statusValue! && statusValue!.length > 0)
    params.status = statusValue![0];

  return instance.post<UseTablesFormatType[]>(
    `/api/${keys.useTables}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.useTables, fieldAction: "read" }), {
    params,
  });
};
export const FindAllUseTableTimeEndIsNull = ({
  findType,
  findValue,
  floorValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<UseTablesFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "table") params.tableName = findValue!;
  }
  if (floorValue! && floorValue!.length > 0)
    params.floorId = floorValue![0];
  if (statusValue! && statusValue!.length > 0)
    params.status = statusValue![0];

  return instance.post<UseTablesFormatType[]>(
    `/api/${keys.useTables}/list-format?timeEnd=null`,
    getNewFormSecurityValue({ fieldName: keys.useTables, fieldAction: "read" }), {
    params,
  });
};
export const HandleUpdateUseTable = ({
  id,
  timeEnd,
  employeeId,
  customerId,
  orderId,
  orderTableId,
  orderTableNewFullname,
  orderTableNewPhone,
  orderTableNewEmail,
  orderTableNewAddress,
  status,
  orderSheets,
}: UseTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.useTables, fieldAction: "update" })),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "use-table",
    new Blob(
      [
        JSON.stringify({
          timeEnd,
          employeeId,
          customerId,
          orderId,
          orderTableId,
          orderTableNewFullname,
          orderTableNewPhone,
          orderTableNewEmail,
          orderTableNewAddress,
          status,
          orderSheets,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.useTables}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Gọi món ăn (Order Sheet)
export const FindAllOrderSheet = ({
  findType,
  findValue,
  floorValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<OrderSheetsFormatType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    // if (findType! === "id") params.id = findValue!;
    // if (findType! === "customer") params.customerId = findValue!;
  }
  // if (timeValue! && timeValue!.length > 0) {
  //   if (timeValue![0] !== "") params.timeCreateStart = timeValue![0];
  //   if (timeValue![1] !== "") params.timeCreateEnd = timeValue![1];
  // }
  if (floorValue! && floorValue!.length > 0)
    params.floorId = floorValue![0];
  if (statusValue! && statusValue!.length > 0)
    params.status = statusValue![0];

  return instance.post<OrderSheetsFormatType[]>(
    `/api/${keys.orderSheets}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.orderSheets, fieldAction: "read" }), {
    params,
  });
};
export const FindAllOrderSheetCurrentDate = ({
  findType,
  findValue,
  floorValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<OrderSheetsFormatType[], any>> => {
  const params: Record<string, string> = {};

  if (floorValue! && floorValue!.length > 0)
    params.floorId = floorValue![0];
  if (statusValue! && statusValue!.length > 0)
    params.status = statusValue![0];

  return instance.post<OrderSheetsFormatType[]>(
    `/api/${keys.orderSheets}/list-format?currentDate`,
    getNewFormSecurityValue({ fieldName: keys.orderSheets, fieldAction: "read" }), {
    params,
  });
};
export const FindOneOrderSheet = (
  id: string
): Promise<AxiosResponse<OrderSheetsFormatType, any>> => {
  return instance.post(
    `/api/${keys.orderSheets}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.orderSheets, fieldAction: "read" })
  );
};
export const HandleCreateOrderSheet = ({
  timeCreate,
  employeeId,
  tableId,
  totalPrice,
  note,
  status,
  orderSheetDetails,
}: OrderSheetsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.orderSheets, fieldAction: "create" })),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "order-sheet",
    new Blob(
      [
        JSON.stringify({
          timeCreate,
          employeeId,
          tableId,
          totalPrice,
          note,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );
  // Chi tiết phiếu gọi món
  if (orderSheetDetails)
    formData.append(
      "order-sheet-details",
      new Blob([JSON.stringify(orderSheetDetails)], {
        type: "application/json",
      })
    );

  return instance.post(`/api/${keys.orderSheets}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateOrderSheet = ({
  id,
  timeService,
  employeeId,
  message,
  status,
}: OrderSheetsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.orderSheets, fieldAction: "update" })),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "order-sheet",
    new Blob(
      [
        JSON.stringify({
          timeService,
          employeeId,
          message,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.orderSheets}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Đơn món ăn (Order)
export const FindAllOrder = ({
  findType,
  findValue,
  timeValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<OrdersFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "customer") params.customerId = findValue!;
  }
  if (timeValue! && timeValue!.length > 0) {
    if (timeValue![0] !== "") params.timeCreateStart = timeValue![0];
    if (timeValue![1] !== "") params.timeCreateEnd = timeValue![1];
  }
  if (statusValue! && statusValue!.length > 0)
    params.statusMerge = statusValue!.join(",");

  return instance.post<OrdersFormatType[]>(
    `/api/orders/list-format`,
    getNewFormSecurityValue({ fieldName: keys.orders, fieldAction: "read" }), {
    params,
  });
};
export const FindOneOrder = (
  id: string
): Promise<AxiosResponse<OrdersFormatType, any>> => {
  return instance.post(
    `/api/orders/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.orders, fieldAction: "read" })
  );
};
export const HandleCreateOrder = ({
  timeCreate,
  employeeId,
  customerId,
  totalPrice,
  payStatus,
  status,
  orderDetails,
}: OrdersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.orders, fieldAction: "create" })),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "order",
    new Blob(
      [
        JSON.stringify({
          timeCreate,
          employeeId,
          customerId,
          totalPrice,
          payStatus,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );
  // Chi tiết đơn hàng
  if (orderDetails)
    formData.append(
      "order-details",
      new Blob([JSON.stringify(orderDetails)], {
        type: "application/json",
      })
    );

  return instance.post(`/api/${keys.orders}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateOrder = ({
  id,
  payStatus,
  status,
}: OrdersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.orders, fieldAction: "update" })),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "order",
    new Blob(
      [
        JSON.stringify({
          payStatus,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.orders}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Đơn đặt bàn (Order Table)
export const FindAllOrderTable = ({
  findType,
  findValue,
  timeValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<OrderTablesFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "fullname") params.fullname = findValue!;
    if (findType! === "phone") params.phone = findValue!;
  }
  if (timeValue! && timeValue!.length > 0) {
    if (timeValue![0] !== "") params.timeOrderStart = timeValue![0];
    if (timeValue![1] !== "") params.timeOrderEnd = timeValue![1];
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<OrderTablesFormatType[]>(
    `/api/${keys.orderTables}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.orderTables, fieldAction: "read" }),
    {
      params,
    }
  );
};
export const FindOneOrderTable = (
  id: string
): Promise<AxiosResponse<OrderTablesFormatType, any>> => {
  return instance.post(
    `/api/${keys.orderTables}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.orderTables, fieldAction: "read" })
  );
};
export const HandleCreateOrderTable = ({
  timeOrder,
  timeArrive,
  employeeId,
  note,
  fullname,
  phone,
  email,
  address,
  status,
}: OrderTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.orderTables, fieldAction: "create" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "order-table",
    new Blob(
      [
        JSON.stringify({
          timeOrder,
          timeArrive,
          employeeId,
          note,
          fullname,
          phone,
          email,
          address,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(`/api/${keys.orderTables}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateOrderTable = ({
  id,
  timeOrder,
  timeArrive,
  note,
  fullname,
  phone,
  email,
  address,
  timeUpdate,
}: OrderTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.orderTables, fieldAction: "update" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "order-table",
    new Blob(
      [
        JSON.stringify({
          timeOrder,
          timeArrive,
          note,
          fullname,
          phone,
          email,
          address,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.orderTables}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockOrderTable = ({
  id,
  status,
  timeUpdate,
}: OrderTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.orderTables, fieldAction: "lock" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "order-table",
    new Blob(
      [
        JSON.stringify({
          status,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.orderTables}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Thẻ khách hàng (Customer Card)
export const FindAllCustomerCard = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<CustomerCardsType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<CustomerCardsType[]>(
    `/api/${keys.customerCards}/list`,
    getNewFormSecurityValue({ fieldName: keys.customerCards, fieldAction: "read" }), {
    params,
  });
};
export const FindOneCustomerCard = (
  id: string
): Promise<AxiosResponse<CustomerCardsType, any>> => {
  return instance.post(
    `/api/${keys.customerCards}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.customerCards, fieldAction: "read" })
  );
};
export const HandleCreateCustomerCard = ({
  image,
  name,
  threshold,
  discount,
  description,
  status,
}: CustomerCardsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.customerCards, fieldAction: "create" })),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "customer-card",
    new Blob(
      [
        JSON.stringify({
          name,
          threshold,
          discount,
          description,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.post(`/api/${keys.customerCards}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateCustomerCard = ({
  id,
  image,
  name,
  threshold,
  discount,
  description,
  timeUpdate,
}: CustomerCardsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.customerCards, fieldAction: "update" })),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "customer-card",
    new Blob(
      [
        JSON.stringify({
          name,
          threshold,
          discount,
          description,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.put(`/api/${keys.customerCards}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockCustomerCard = ({
  id,
  status,
  timeUpdate,
}: CustomerCardsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.customerCards, fieldAction: "lock" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "customer-card",
    new Blob(
      [
        JSON.stringify({
          status,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.customerCards}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Khách hàng (Customer)
export const FindAllCustomer = ({
  findType,
  findValue,
  customerCardValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<CustomersFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "fullname") params.fullname = findValue!;
    if (findType! === "phone") params.phone = findValue!;
    if (findType! === "email") params.email = findValue!;
  }
  if (customerCardValue! && customerCardValue!.length > 0)
    params.customerCardId = customerCardValue!.join(",");
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<CustomersFormatType[]>(
    `/api/${keys.customers}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.customers, fieldAction: "read" }), {
    params,
  });
};
export const FindOneCustomer = (
  id: string
): Promise<AxiosResponse<CustomersFormatType, any>> => {
  return instance.post(
    `/api/${keys.customers}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.customers, fieldAction: "read" })
  );
};
export const HandleCreateCustomer = ({
  customerCardId,
  totalThreshold,
  fullname,
  birthday,
  gender,
  phone,
  email,
  address,
  description,
  status,
}: CustomersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.customers, fieldAction: "create" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "customer",
    new Blob(
      [
        JSON.stringify({
          customerCardId,
          totalThreshold,
          fullname,
          birthday,
          gender,
          phone,
          email,
          address,
          description,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(`/api/${keys.customers}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateCustomer = ({
  id,
  customerCardId,
  fullname,
  birthday,
  gender,
  phone,
  email,
  address,
  description,
  timeUpdate,
}: CustomersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.customers, fieldAction: "update" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "customer",
    new Blob(
      [
        JSON.stringify({
          customerCardId,
          fullname,
          birthday,
          gender,
          phone,
          email,
          address,
          description,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.customers}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockCustomer = ({
  id,
  status,
  timeUpdate,
}: CustomersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.customers, fieldAction: "lock" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "customer",
    new Blob(
      [
        JSON.stringify({
          status,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.customers}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Tầng (Floor)
export const FindAllFloor = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<FloorsType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<FloorsType[]>(
    `/api/${keys.floors}/list`,
    getNewFormSecurityValue({ fieldName: keys.floors, fieldAction: "read" }), {
    params,
  });
};
export const FindOneFloor = (
  id: string
): Promise<AxiosResponse<FloorsType, any>> => {
  return instance.post(
    `/api/floors/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.floors, fieldAction: "read" })
  );
};
export const HandleCreateFloor = ({
  name,
  description,
  status,
}: FloorsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.floors, fieldAction: "create" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "floor",
    new Blob(
      [
        JSON.stringify({
          name,
          description,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(`/api/${keys.floors}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateFloor = ({
  id,
  name,
  description,
  timeUpdate,
}: FloorsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.floors, fieldAction: "update" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "floor",
    new Blob(
      [
        JSON.stringify({
          name,
          description,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.floors}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockFloor = ({
  id,
  status,
  timeUpdate,
}: FloorsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.floors, fieldAction: "lock" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "floor",
    new Blob(
      [
        JSON.stringify({
          status,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.floors}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Loại bàn ăn (Category Table)
export const FindAllCategoryTable = ({
  findType,
  findValue,
  surchargeTypeValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<CategoryTablesType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (surchargeTypeValue! && surchargeTypeValue!.length > 0)
    params.surchargeType = surchargeTypeValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<CategoryTablesType[]>(
    `/api/${keys.categoryTables}/list`,
    getNewFormSecurityValue({ fieldName: keys.categoryTables, fieldAction: "read" }), {
    params,
  }
  );
};
export const FindOneCategoryTable = (
  id: string
): Promise<AxiosResponse<CategoryTablesType, any>> => {
  return instance.post(
    `/api/${keys.categoryTables}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.categoryTables, fieldAction: "read" })
  );
};
export const HandleCreateCategoryTable = ({
  name,
  surchargeType,
  surchargeValue,
  description,
  status,
}: CategoryTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.categoryTables, fieldAction: "create" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "category-table",
    new Blob(
      [
        JSON.stringify({
          name,
          surchargeType,
          surchargeValue,
          description,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(`/api/${keys.categoryTables}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateCategoryTable = ({
  id,
  name,
  surchargeType,
  surchargeValue,
  description,
  timeUpdate,
}: CategoryTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.categoryTables, fieldAction: "update" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "category-table",
    new Blob(
      [
        JSON.stringify({
          name,
          surchargeType,
          surchargeValue,
          description,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.categoryTables}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockCategoryTable = ({
  id,
  status,
  timeUpdate,
}: CategoryTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.categoryTables, fieldAction: "lock" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "category-table",
    new Blob(
      [
        JSON.stringify({
          status,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.categoryTables}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Bàn ăn (Table)
export const FindAllTable = ({
  findType,
  findValue,
  categoryValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<TablesFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (categoryValue! && categoryValue!.length > 0)
    params.categoryTableId = categoryValue!.join(",");
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<TablesFormatType[]>(
    `/api/${keys.tables}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.tables, fieldAction: "read" }), {
    params,
  });
};
export const FindOneTable = (
  id: string
): Promise<AxiosResponse<TablesFormatType, any>> => {
  return instance.post(
    `/api/${keys.tables}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.tables, fieldAction: "read" })
  );
};
export const HandleCreateTable = ({
  name,
  categoryTableId,
  floorId,
  seats,
  description,
  status,
}: TablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.tables, fieldAction: "create" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "table",
    new Blob(
      [
        JSON.stringify({
          name,
          categoryTableId,
          floorId,
          seats,
          description,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(`/api/${keys.tables}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateTable = ({
  id,
  name,
  categoryTableId,
  floorId,
  seats,
  description,
  timeUpdate,
}: TablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.tables, fieldAction: "update" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "table",
    new Blob(
      [
        JSON.stringify({
          id,
          name,
          categoryTableId,
          floorId,
          seats,
          description,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.tables}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockTable = ({
  id,
  status,
  timeUpdate,
}: TablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.tables, fieldAction: "lock" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "table",
    new Blob(
      [
        JSON.stringify({
          id,
          status,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.tables}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Phiếu nhập (Input Ticket)
export const FindAllInputTicket = ({
  findType,
  findValue,
  timeValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<InputTicketsFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "supplier") params.supplierId = findValue!;
  }
  if (timeValue! && timeValue!.length > 0) {
    if (timeValue![0] !== "") params.timeCreateStart = timeValue![0];
    if (timeValue![1] !== "") params.timeCreateEnd = timeValue![1];
  }
  if (statusValue! && statusValue!.length > 0)
    params.statusMerge = statusValue!.join(",");

  return instance.post<InputTicketsFormatType[]>(
    `/api/${keys.inputTickets}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.inputTickets, fieldAction: "read" }),
    {
      params,
    }
  );
};
export const FindOneInputTicket = (
  id: string
): Promise<AxiosResponse<InputTicketsFormatType, any>> => {
  return instance.post(
    `/api/${keys.inputTickets}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.inputTickets, fieldAction: "read" })
  );
};
export const HandleCreateInputTicket = ({
  timeCreate,
  employeeId,
  supplierId,
  totalPrice,
  payStatus,
  status,
  inputTicketDetails,
}: InputTicketsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.inputTickets, fieldAction: "create" })),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "input-ticket",
    new Blob(
      [
        JSON.stringify({
          timeCreate,
          employeeId,
          supplierId,
          totalPrice,
          payStatus,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );
  // Chi tiết phiếu nhập
  if (inputTicketDetails)
    formData.append(
      "input-ticket-details",
      new Blob([JSON.stringify(inputTicketDetails)], {
        type: "application/json",
      })
    );

  return instance.post(`/api/${keys.inputTickets}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateInputTicket = ({
  id,
  payStatus,
  status,
}: InputTicketsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.inputTickets, fieldAction: "update" })),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "input-ticket",
    new Blob(
      [
        JSON.stringify({
          payStatus,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.inputTickets}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Nhà cung cấp (Supplier)
export const FindAllSupplier = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<SuppliersType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
    if (findType! === "phone") params.phone = findValue!;
    if (findType! === "email") params.email = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<SuppliersType[]>(
    `/api/${keys.suppliers}/list`,
    getNewFormSecurityValue({ fieldName: keys.suppliers, fieldAction: "read" }), {
    params,
  });
};
export const FindOneSupplier = (
  id: string
): Promise<AxiosResponse<SuppliersType, any>> => {
  return instance.post(
    `/api/${keys.suppliers}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.suppliers, fieldAction: "read" })
  );
};
export const HandleCreateSupplier = ({
  name,
  phone,
  email,
  address,
  status,
}: SuppliersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.suppliers, fieldAction: "create" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "supplier",
    new Blob(
      [
        JSON.stringify({
          name,
          phone,
          email,
          address,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(`/api/${keys.suppliers}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateSupplier = ({
  id,
  name,
  phone,
  email,
  address,
  timeUpdate,
}: SuppliersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.suppliers, fieldAction: "update" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "supplier",
    new Blob(
      [
        JSON.stringify({
          name,
          phone,
          email,
          address,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.suppliers}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockSupplier = ({
  id,
  status,
  timeUpdate,
}: SuppliersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.suppliers, fieldAction: "lock" }))
      ],
      { type: "application/json" }
    )
  )
  // Đối tượng
  formData.append(
    "supplier",
    new Blob(
      [
        JSON.stringify({
          status,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.suppliers}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Loại nguyên liệu (Category Ingredient)
export const FindAllCategoryIngredient = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<CategoryIngredientsType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<CategoryIngredientsType[]>(
    `/api/${keys.categoryIngredients}/list`,
    getNewFormSecurityValue({ fieldName: keys.categoryIngredients, fieldAction: "read" }), {
    params,
  });
};
export const FindOneCategoryIngredient = (
  id: string
): Promise<AxiosResponse<CategoryIngredientsType, any>> => {
  return instance.post(
    `/api/${keys.categoryIngredients}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.categoryIngredients, fieldAction: "read" })
  );
};
export const HandleCreateCategoryIngredient = ({
  name,
  description,
  status,
}: CategoryIngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.categoryIngredients, fieldAction: "create" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "category-ingredient",
    new Blob(
      [
        JSON.stringify({
          name,
          description,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(`/api/${keys.categoryIngredients}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateCategoryIngredient = ({
  id,
  name,
  description,
  timeUpdate,
}: CategoryIngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.categoryIngredients, fieldAction: "update" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "category-ingredient",
    new Blob(
      [
        JSON.stringify({
          name,
          description,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.categoryIngredients}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockCategoryIngredient = ({
  id,
  status,
  timeUpdate,
}: CategoryIngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.categoryIngredients, fieldAction: "lock" }))
      ],
      { type: "application/json" }
    )
  )
  // Đối tượng
  formData.append(
    "category-ingredient",
    new Blob(
      [
        JSON.stringify({
          status,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.categoryIngredients}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Nguyên liệu (Ingredient)
export const FindAllIngredient = ({
  findType,
  findValue,
  categoryValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<IngredientsFormatType[], any>> => {
  // Tham số đẻ lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (categoryValue! && categoryValue!.length > 0)
    params.categoryIngredientId = categoryValue!.join(",");
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<IngredientsFormatType[]>(
    `/api/${keys.ingredients}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.ingredients, fieldAction: "read" }), {
    params,
  });
};
export const FindOneIngredient = (
  id: string
): Promise<AxiosResponse<IngredientsFormatType, any>> => {
  return instance.post(
    `/api/${keys.ingredients}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.ingredients, fieldAction: "read" })
  );
};
export const HandleCreateIngredient = ({
  name,
  categoryIngredientId,
  unit,
  capacity,
  dateCreate,
  dateRemove,
  inputPrice,
  inventory,
  note,
  status,
}: IngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.ingredients, fieldAction: "create" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "ingredient",
    new Blob(
      [
        JSON.stringify({
          name,
          categoryIngredientId,
          unit,
          capacity,
          dateCreate,
          dateRemove,
          inputPrice,
          inventory,
          note,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(`/api/${keys.ingredients}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateIngredient = ({
  id,
  name,
  categoryIngredientId,
  unit,
  capacity,
  dateCreate,
  dateRemove,
  inputPrice,
  note,
  timeUpdate,
}: IngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.ingredients, fieldAction: "update" }))
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "ingredient",
    new Blob(
      [
        JSON.stringify({
          name,
          categoryIngredientId,
          unit,
          capacity,
          dateCreate,
          dateRemove,
          inputPrice,
          note,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.ingredients}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockIngredient = ({
  id,
  status,
  timeUpdate,
}: IngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.ingredients, fieldAction: "lock" }))
      ],
      { type: "application/json" }
    )
  )
  // Đối tượng
  formData.append(
    "ingredient",
    new Blob(
      [
        JSON.stringify({
          status,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.ingredients}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Loại món ăn (Category Food)
export const FindAllCategoryFood = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<CategoryFoodsType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<CategoryFoodsType[]>(
    `/api/${keys.categoryFoods}/list`,
    getNewFormSecurityValue({ fieldName: keys.categoryFoods, fieldAction: "read" }), {
    params,
  });
};
export const FindOneCategoryFood = (
  id: string
): Promise<AxiosResponse<CategoryFoodsType, any>> => {
  return instance.post(
    `/api/${keys.categoryFoods}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.categoryFoods, fieldAction: "read" })
  );
};
export const HandleCreateCategoryFood = ({
  name,
  image,
  description,
  status,
}: CategoryFoodsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.categoryFoods, fieldAction: "create" }))
      ],
      { type: "application/json" }
    )
  )
  // Đối tượng
  formData.append(
    "category-food",
    new Blob(
      [
        JSON.stringify({
          name,
          description,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.post(`/api/${keys.categoryFoods}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateCategoryFood = ({
  id,
  name,
  image,
  description,
  timeUpdate,
}: CategoryFoodsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.categoryFoods, fieldAction: "update" }))
      ],
      { type: "application/json" }
    )
  )
  // Đối tượng
  formData.append(
    "category-food",
    new Blob(
      [
        JSON.stringify({
          name,
          description,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.put(`/api/${keys.categoryFoods}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockCategoryFood = ({
  id,
  status,
  timeUpdate,
}: CategoryFoodsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.categoryFoods, fieldAction: "lock" }))
      ],
      { type: "application/json" }
    )
  )
  // Đối tượng
  formData.append(
    "category-food",
    new Blob(
      [
        JSON.stringify({
          status,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.categoryFoods}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Món ăn (Food)
export const FindAllFood = ({
  findType,
  findValue,
  categoryValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<FoodsFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (categoryValue! && categoryValue!.length > 0)
    params.categoryFoodId = categoryValue!.join(",");
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<FoodsFormatType[]>(
    `/api/${keys.foods}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.foods, fieldAction: "read" }), {
    params,
  });
};
export const FindOneFood = (
  id: string
): Promise<AxiosResponse<FoodsFormatType, any>> => {
  return instance.post(
    `/api/${keys.foods}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.foods, fieldAction: "read" })
  );
};
export const HandleCreateFood = ({
  name,
  image,
  categoryFoodId,
  unit,
  price,
  description,
  status,
  recipe,
}: FoodsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.foods, fieldAction: "create" }))
      ],
      { type: "application/json" }
    )
  )
  // Thông tin cơ bản
  formData.append(
    "food",
    new Blob(
      [
        JSON.stringify({
          name,
          categoryFoodId,
          unit,
          price,
          description,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );
  // Công thức món ăn
  if (recipe)
    formData.append(
      "recipe",
      new Blob([JSON.stringify(recipe)], { type: "application/json" })
    );
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.post(`/api/${keys.foods}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateFood = ({
  id,
  name,
  image,
  categoryFoodId,
  unit,
  price,
  description,
  timeUpdate,
  recipe,
}: FoodsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.foods, fieldAction: "update" }))
      ],
      { type: "application/json" }
    )
  )
  // Thông tin cơ bản
  formData.append(
    "food",
    new Blob(
      [
        JSON.stringify({
          name,
          categoryFoodId,
          unit,
          price,
          description,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );
  // Công thức món ăn
  if (recipe)
    formData.append(
      "recipe",
      new Blob([JSON.stringify(recipe)], { type: "application/json" })
    );
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.put(`/api/${keys.foods}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockFood = ({
  id,
  status,
  timeUpdate,
}: FoodsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.foods, fieldAction: "lock" }))
      ],
      { type: "application/json" }
    )
  )
  // Đối tượng
  formData.append(
    "food",
    new Blob(
      [
        JSON.stringify({
          status,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.foods}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Chức vụ (Role)
export const FindAllRole = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<RolesFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<RolesFormatType[]>(
    `/api/${keys.roles}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.roles, fieldAction: "read" }), {
    params,
  });
};
export const FindOneRole = (
  id: string
): Promise<AxiosResponse<RolesFormatType, any>> => {
  return instance.post(
    `/api/${keys.roles}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.roles, fieldAction: "read" })
  );
};
export const HandleCreateRole = ({
  name,
  salary,
  status,
  roleDetails,
}: RolesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.roles, fieldAction: "create" })),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "role",
    new Blob(
      [
        JSON.stringify({
          name,
          salary,
          status,
          roleDetails,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(`/api/${keys.roles}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateRole = ({
  id,
  name,
  salary,
  timeUpdate,
  roleDetails,
}: RolesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.roles, fieldAction: "update" })),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "role",
    new Blob(
      [
        JSON.stringify({
          name,
          salary,
          timeUpdate,
          roleDetails,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.roles}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockRole = ({
  id,
  status,
  timeUpdate,
}: RolesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.roles, fieldAction: "lock" })),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "role",
    new Blob(
      [
        JSON.stringify({
          status,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.roles}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Nhân viên (Employee)
export const FindAllEmployee = ({
  findType,
  findValue,
  roleValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<EmployeesFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "fullname") params.fullname = findValue!;
    if (findType! === "phone") params.phone = findValue!;
    if (findType! === "email") params.email = findValue!;
  }
  if (roleValue! && roleValue!.length > 0) params.roleId = roleValue!.join(",");
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<EmployeesFormatType[]>(
    `/api/${keys.employees}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.employees, fieldAction: "read" }), {
    params,
  });
};
export const FindOneEmployee = (
  id: string
): Promise<AxiosResponse<EmployeesType, any>> => {
  return instance.post(
    `/api/${keys.employees}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.employees, fieldAction: "read" })
  );
};
export const HandleCreateEmployee = ({
  image,
  fullname,
  birthday,
  gender,
  phone,
  email,
  address,
  dateBegin,
  dateEnd,
  roleId,
  username,
  password,
  status,
}: EmployeesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.employees, fieldAction: "create" })),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "employee",
    new Blob(
      [
        JSON.stringify({
          fullname,
          birthday,
          gender,
          phone,
          email,
          address,
          dateBegin,
          dateEnd,
          roleId,
          username,
          password,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.post(`/api/${keys.employees}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateEmployee = ({
  id,
  image,
  fullname,
  birthday,
  gender,
  phone,
  email,
  address,
  dateBegin,
  dateEnd,
  roleId,
  timeUpdate,
}: EmployeesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.employees, fieldAction: "update" })),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "employee",
    new Blob(
      [
        JSON.stringify({
          fullname,
          birthday,
          gender,
          phone,
          email,
          address,
          dateBegin,
          dateEnd,
          roleId,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );
  if (image) formData.append("image-file", image);

  return instance.put(`/api/${keys.employees}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockEmployee = ({
  id,
  status,
  timeUpdate,
}: EmployeesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.employees, fieldAction: "lock" })),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "employee",
    new Blob(
      [
        JSON.stringify({
          status,
          timeUpdate
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.employees}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleChangePasswordEmployee = ({
  id,
  currentPassword,
  newPassword,
  authNewPassword,
  timeUpdate,
}: {
  id?: number;
  currentPassword?: string;
  newPassword?: string;
  authNewPassword?: string;
  timeUpdate?: string;
}): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(getNewFormSecurityValue({ fieldName: keys.employees, fieldAction: "change-password" })),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "employee",
    new Blob(
      [
        JSON.stringify({
          currentPassword,
          newPassword,
          authNewPassword,
          timeUpdate,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.employees}/change-password/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Chức năng (Function)
export const FindAllFunction = (): Promise<
  AxiosResponse<FunctionsType[], any>
> => {
  return instance.post<FunctionsType[]>(
    `/api/${keys.functions}/list`,
    getNewFormSecurityValue({ fieldName: keys.functions, fieldAction: "read" })
  );
};
