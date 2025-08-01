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

// Form chung để truy vấn dữ liệu (bảo mật)
const formGetDataValue = {
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

const formGetDataTempValue = {
  project: {
    name: "vinaeater",
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


// Các API đăng nhập và đăng xuất
export const HandleLogin = (
  { username, password }: { username: string, password: string }
): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.post("/api/auth/login", {
    username: username,
    password: password,
  });
};
export const HandleLogout = (): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.post("/api/auth/logout");
}

// Các api của đối tượng Sử dụng bàn ăn (Use Table)
export const FindOneNewUseTableByTableId = ({
  tableId,
}: {
  tableId: string;
}): Promise<AxiosResponse<UseTablesFormatType, any>> => {
  return instance.post(`/api/use-tables/${tableId}`, formGetDataValue);
};
export const FindAllUseTable = ({
  findType,
  findValue,
  timeValue,
  floorValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<UseTablesFormatType[], any>> => {
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
    "/api/use-tables/list-format",
    formGetDataValue,
    {
      params,
    }
  );
};
export const FindAllUseTableTimeEndIsNull = ({
  findType,
  findValue,
  floorValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<UseTablesFormatType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    if (findType! === "table") params.tableName = findValue!;
  }
  if (floorValue! && floorValue!.length > 0)
    params.floorId = floorValue![0];
  if (statusValue! && statusValue!.length > 0)
    params.status = statusValue![0];

  return instance.post<UseTablesFormatType[]>(
    "/api/use-tables/list-format?timeEnd=null",
    formGetDataValue,
    {
      params,
    }
  );
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
  return instance.put(`/api/use-tables/update/${id}`, {
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
    orderSheets
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
    "/api/order-sheets/list-format",
    formGetDataValue,
    {
      params,
    }
  );
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
    "/api/order-sheets/list-format?currentDate",
    formGetDataValue,
    {
      params,
    }
  );
};
export const FindOneOrderSheet = (
  id: string
): Promise<AxiosResponse<OrderSheetsFormatType, any>> => {
  return instance.post(`/api/order-sheets/detail/${id}`, formGetDataValue);
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
  const formData = new FormData();

  formData.append(
    "orderSheet",
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
  if (orderSheetDetails)
    formData.append(
      "orderSheetDetails",
      new Blob([JSON.stringify(orderSheetDetails)], {
        type: "application/json",
      })
    );

  return instance.post(`/api/order-sheets/create`, formData, {
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
  return instance.put(`/api/order-sheets/update/${id}`, {
    timeService,
    employeeId,
    message,
    status,
  });
};

// Các api của đối tượng Đơn món ăn (Order)
export const FindAllOrder = ({
  findType,
  findValue,
  timeValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<OrdersFormatType[], any>> => {
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
    "/api/orders/list-format",
    formGetDataValue,
    {
      params,
    }
  );
};
export const FindOneOrder = (
  id: string
): Promise<AxiosResponse<OrdersFormatType, any>> => {
  return instance.post(`/api/orders/detail/${id}`, formGetDataValue);
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
  const formData = new FormData();

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
  if (orderDetails)
    formData.append(
      "orderDetails",
      new Blob([JSON.stringify(orderDetails)], {
        type: "application/json",
      })
    );

  return instance.post(`/api/orders/create`, formData, {
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
  return instance.put(`/api/orders/update/${id}`, {
    payStatus,
    status,
  });
};

// Các api của đối tượng Đơn đặt bàn (Order Table)
export const FindAllOrderTable = ({
  findType,
  findValue,
  timeValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<OrderTablesFormatType[], any>> => {
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
    "/api/order-tables/list-format",
    formGetDataValue,
    {
      params,
    }
  );
};
export const FindOneOrderTable = (
  id: string
): Promise<AxiosResponse<OrderTablesFormatType, any>> => {
  return instance.post(`/api/order-tables/detail/${id}`, formGetDataValue);
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
  return instance.post(`/api/order-tables/create`, {
    timeOrder,
    timeArrive,
    employeeId,
    note,
    fullname,
    phone,
    email,
    address,
    status,
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
  return instance.put(`/api/order-tables/update/${id}`, {
    timeOrder,
    timeArrive,
    note,
    fullname,
    phone,
    email,
    address,
    timeUpdate,
  });
};
export const HandleLockOrderTable = ({
  id,
  status,
  timeUpdate,
}: OrderTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.put(`/api/order-tables/lock/${id}`, {
    status,
    timeUpdate,
  });
};

// Các api của đối tượng Thẻ khách hàng (Customer Card)
export const FindAllCustomerCard = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<CustomerCardsType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<CustomerCardsType[]>("/api/customer-cards/list", formGetDataValue, {
    params,
  });
};
export const FindOneCustomerCard = (
  id: string
): Promise<AxiosResponse<CustomerCardsType, any>> => {
  return instance.post(`/api/customer-cards/detail/${id}`, formGetDataValue);
};
export const HandleCreateCustomerCard = ({
  image,
  name,
  threshold,
  discount,
  description,
  status,
}: CustomerCardsType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = new FormData();

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
  if (image) formData.append("image-file", image);

  return instance.post(`/api/customer-cards/create`, formData, {
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
  const formData = new FormData();

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
  if (image) formData.append("image-file", image);

  return instance.put(`/api/customer-cards/update/${id}`, formData, {
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
  return instance.put(`/api/customer-cards/lock/${id}`, {
    status,
    timeUpdate,
  });
};

// Các api của đối tượng Khách hàng (Customer)
export const FindAllCustomer = ({
  findType,
  findValue,
  customerCardValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<CustomersFormatType[], any>> => {
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

  return instance.post<CustomersFormatType[]>("/api/customers/list-format", formGetDataValue, {
    params,
  });
};
export const FindOneCustomer = (
  id: string
): Promise<AxiosResponse<CustomersFormatType, any>> => {
  return instance.post(`/api/customers/detail/${id}`, formGetDataValue);
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
  return instance.post(`/api/customers/create`, {
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
  return instance.put(`/api/customers/update/${id}`, {
    customerCardId,
    fullname,
    birthday,
    gender,
    phone,
    email,
    address,
    description,
    timeUpdate,
  });
};
export const HandleLockCustomer = ({
  id,
  status,
  timeUpdate,
}: CustomersType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.put(`/api/customers/lock/${id}`, {
    status,
    timeUpdate,
  });
};

// Các api của đối tượng Tầng (Floor)
export const FindAllFloor = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<FloorsType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<FloorsType[]>("/api/floors/list", formGetDataValue, {
    params,
  });
};
export const FindOneFloor = (
  id: string
): Promise<AxiosResponse<FloorsType, any>> => {
  return instance.post(`/api/floors/detail/${id}`, formGetDataValue);
};
export const HandleCreateFloor = ({
  name,
  description,
  status,
}: FloorsType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.post(`/api/floors/create`, {
    name,
    description,
    status,
  });
};
export const HandleUpdateFloor = ({
  id,
  name,
  description,
  timeUpdate,
}: FloorsType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.put(`/api/floors/update/${id}`, {
    name,
    description,
    timeUpdate,
  });
};
export const HandleLockFloor = ({
  id,
  status,
  timeUpdate,
}: FloorsType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.put(`/api/floors/lock/${id}`, {
    status,
    timeUpdate,
  });
};

// Các api của đối tượng Loại bàn (Category Table)
export const FindAllCategoryTable = ({
  findType,
  findValue,
  surchargeTypeValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<CategoryTablesType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (surchargeTypeValue! && surchargeTypeValue!.length > 0)
    params.surchargeType = surchargeTypeValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<CategoryTablesType[]>(
    "/api/category-tables/list",
    formGetDataValue, {
    params,
  }
  );
};
export const FindOneCategoryTable = (
  id: string
): Promise<AxiosResponse<CategoryTablesType, any>> => {
  return instance.post(`/api/category-tables/detail/${id}`, formGetDataValue);
};
export const HandleCreateCategoryTable = ({
  name,
  surchargeType,
  surchargeValue,
  description,
  status,
}: CategoryTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.post(`/api/category-tables/create`, {
    name,
    surchargeType,
    surchargeValue,
    description,
    status,
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
  return instance.put(`/api/category-tables/update/${id}`, {
    name,
    surchargeType,
    surchargeValue,
    description,
    timeUpdate,
  });
};
export const HandleLockCategoryTable = ({
  id,
  status,
  timeUpdate,
}: CategoryTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  console.log(status);

  return instance.put(`/api/category-tables/lock/${id}`, {
    status,
    timeUpdate,
  });
};

// Các api của đối tượng Bàn ăn (Table)
export const FindAllTable = ({
  findType,
  findValue,
  categoryValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<TablesFormatType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (categoryValue! && categoryValue!.length > 0)
    params.categoryTableId = categoryValue!.join(",");
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<TablesFormatType[]>("/api/tables/list-format", formGetDataValue, {
    params,
  });
};
export const FindOneTable = (
  id: string
): Promise<AxiosResponse<TablesFormatType, any>> => {
  return instance.post(`/api/tables/detail/${id}`, formGetDataValue);
};
export const HandleCreateTable = ({
  name,
  categoryTableId,
  floorId,
  seats,
  description,
  status,
}: TablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.post(`/api/tables/create`, {
    name,
    categoryTableId,
    floorId,
    seats,
    description,
    status,
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
  return instance.put(`/api/tables/update/${id}`, {
    name,
    categoryTableId,
    floorId,
    seats,
    description,
    timeUpdate,
  });
};
export const HandleLockTable = ({
  id,
  status,
  timeUpdate,
}: TablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.put(`/api/tables/lock/${id}`, {
    status,
    timeUpdate,
  });
};

// Các api của đối tượng Phiếu nhập (Input Ticket)
export const FindAllInputTicket = ({
  findType,
  findValue,
  timeValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<InputTicketsFormatType[], any>> => {
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
    "/api/input-tickets/list-format",
    formGetDataValue,
    {
      params,
    }
  );
};
export const FindOneInputTicket = (
  id: string
): Promise<AxiosResponse<InputTicketsFormatType, any>> => {
  return instance.post(`/api/input-tickets/detail/${id}`, formGetDataValue);
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
  const formData = new FormData();

  formData.append(
    "inputTicket",
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
  if (inputTicketDetails)
    formData.append(
      "inputTicketDetails",
      new Blob([JSON.stringify(inputTicketDetails)], {
        type: "application/json",
      })
    );

  return instance.post(`/api/input-tickets/create`, formData, {
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
  return instance.put(`/api/input-tickets/update/${id}`, {
    payStatus,
    status,
  });
};

// Các api của đối tượng Nhà cung cấp (Supplier)
export const FindAllSupplier = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<SuppliersType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
    if (findType! === "phone") params.phone = findValue!;
    if (findType! === "email") params.email = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<SuppliersType[]>("/api/suppliers/list", formGetDataValue, {
    params,
  });
};
export const FindOneSupplier = (
  id: string
): Promise<AxiosResponse<SuppliersType, any>> => {
  return instance.post(`/api/suppliers/detail/${id}`, formGetDataValue);
};
export const HandleCreateSupplier = ({
  name,
  phone,
  email,
  address,
  status,
}: SuppliersType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.post(`/api/suppliers/create`, {
    name,
    phone,
    email,
    address,
    status,
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
  return instance.put(`/api/suppliers/update/${id}`, {
    name,
    phone,
    email,
    address,
    timeUpdate,
  });
};
export const HandleLockSupplier = ({
  id,
  status,
  timeUpdate,
}: SuppliersType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.put(`/api/suppliers/lock/${id}`, {
    status,
    timeUpdate,
  });
};

// Các api của đối tượng Loại nguyên liệu (Category Ingredient)
export const FindAllCategoryIngredient = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<CategoryIngredientsType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<CategoryIngredientsType[]>(
    "/api/category-ingredients/list", formGetDataValue,
    {
      params,
    }
  );
};
export const FindOneCategoryIngredient = (
  id: string
): Promise<AxiosResponse<CategoryIngredientsType, any>> => {
  return instance.post(`/api/category-ingredients/detail/${id}`, formGetDataValue);
};
export const HandleCreateCategoryIngredient = ({
  name,
  description,
  status,
}: CategoryIngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.post(`/api/category-ingredients/create`, {
    name,
    description,
    status,
  });
};
export const HandleUpdateCategoryIngredient = ({
  id,
  name,
  description,
  timeUpdate,
}: CategoryIngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.put(`/api/category-ingredients/update/${id}`, {
    name,
    description,
    timeUpdate,
  });
};
export const HandleLockCategoryIngredient = ({
  id,
  status,
  timeUpdate,
}: CategoryIngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.put(`/api/category-ingredients/lock/${id}`, {
    status,
    timeUpdate,
  });
};

// Các api của đối tượng Nguyên liệu (Ingredient)
export const FindAllIngredient = ({
  findType,
  findValue,
  categoryValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<IngredientsFormatType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (categoryValue! && categoryValue!.length > 0)
    params.categoryIngredientId = categoryValue!.join(",");
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<IngredientsFormatType[]>("/api/ingredients/list-format", formGetDataValue, {
    params,
  });
};
export const FindOneIngredient = (
  id: string
): Promise<AxiosResponse<IngredientsFormatType, any>> => {
  return instance.post(`/api/ingredients/detail/${id}`, formGetDataValue);
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
  return instance.post(`/api/ingredients/create`, {
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
  return instance.put(`/api/ingredients/update/${id}`, {
    name,
    categoryIngredientId,
    unit,
    capacity,
    dateCreate,
    dateRemove,
    inputPrice,
    note,
    timeUpdate,
  });
};
export const HandleLockIngredient = ({
  id,
  status,
  timeUpdate,
}: IngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.put(`/api/ingredients/lock/${id}`, {
    status,
    timeUpdate,
  });
};

// Các api của đối tượng Loại món ăn (Category Food)
export const FindAllCategoryFood = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<CategoryFoodsType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<CategoryFoodsType[]>("/api/category-foods/list", formGetDataValue, {
    params,
  });
};
export const FindOneCategoryFood = (
  id: string
): Promise<AxiosResponse<CategoryFoodsType, any>> => {
  return instance.post(`/api/category-foods/detail/${id}`, formGetDataValue);
};
export const HandleCreateCategoryFood = ({
  name,
  image,
  description,
  status,
}: CategoryFoodsType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = new FormData();

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
  if (image) formData.append("image-file", image);

  return instance.post(`/api/category-foods/create`, formData, {
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
  const formData = new FormData();

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
  if (image) formData.append("image-file", image);

  return instance.put(`/api/category-foods/update/${id}`, formData, {
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
  return instance.put(`/api/category-foods/lock/${id}`, {
    status,
    timeUpdate,
  });
};

// Các api của đối tượng Món ăn (Food)
export const FindAllFood = ({
  findType,
  findValue,
  categoryValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<FoodsFormatType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (categoryValue! && categoryValue!.length > 0)
    params.categoryFoodId = categoryValue!.join(",");
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<FoodsFormatType[]>("/api/foods/list-format", formGetDataValue, {
    params,
  });
};
export const FindOneFood = (
  id: string
): Promise<AxiosResponse<FoodsFormatType, any>> => {
  return instance.post(`/api/foods/detail/${id}`, formGetDataValue);
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
  const formData = new FormData();

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
  if (recipe)
    formData.append(
      "recipe",
      new Blob([JSON.stringify(recipe)], { type: "application/json" })
    );
  if (image) formData.append("image-file", image);

  return instance.post(`/api/foods/create`, formData, {
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
  const formData = new FormData();

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
  if (recipe)
    formData.append(
      "recipe",
      new Blob([JSON.stringify(recipe)], { type: "application/json" })
    );
  if (image) formData.append("image-file", image);

  return instance.put(`/api/foods/update/${id}`, formData, {
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
  return instance.put(`/api/foods/lock/${id}`, {
    status,
    timeUpdate,
  });
};

// Các api của đối tượng Chức vụ (Role)
export const FindAllRole = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<RolesFormatType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<RolesFormatType[]>("/api/roles/list-format", formGetDataValue, {
    params,
  });
};
export const FindOneRole = (
  id: string
): Promise<AxiosResponse<RolesFormatType, any>> => {
  return instance.post(`/api/roles/detail/${id}`, formGetDataValue);
};
export const HandleCreateRole = ({
  name,
  salary,
  status,
  roleDetails,
}: RolesType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.post(`/api/roles/create`, {
    name,
    salary,
    status,
    roleDetails,
  });
};
export const HandleUpdateRole = ({
  id,
  name,
  salary,
  timeUpdate,
  roleDetails,
}: RolesType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.put(`/api/roles/update/${id}`, {
    name,
    salary,
    timeUpdate,
    roleDetails,
  });
};
export const HandleLockRole = ({
  id,
  status,
  timeUpdate,
}: RolesType): Promise<AxiosResponse<RestResponseType, any>> => {
  return instance.put(`/api/roles/lock/${id}`, {
    status,
    timeUpdate,
  });
};

// Các api của đối tượng Nhân viên (Employee)
export const FindAllEmployee = ({
  findType,
  findValue,
  roleValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<EmployeesFormatType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "fullname") params.fullname = findValue!;
    if (findType! === "phone") params.phone = findValue!;
    if (findType! === "email") params.email = findValue!;
  }
  if (roleValue! && roleValue!.length > 0) params.roleId = roleValue!.join(",");
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<EmployeesFormatType[]>("/api/employees/list-format", formGetDataValue, {
    params,
  });
};
export const FindOneEmployee = (
  id: string
): Promise<AxiosResponse<EmployeesType, any>> => {
  return instance.post(`/api/employees/detail/${id}`, formGetDataValue);
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
  const formData = new FormData();

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
  if (image) formData.append("image-file", image);

  return instance.post(`/api/employees/create`, formData, {
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
  const formData = new FormData();

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

  return instance.put(`/api/employees/update/${id}`, formData, {
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
  return instance.put(`/api/employees/lock/${id}`, {
    status,
    timeUpdate,
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
  return instance.put(`/api/employees/change-password/${id}`, {
    currentPassword,
    newPassword,
    authNewPassword,
    timeUpdate,
  });
};

// Các api của đối tượng Chức năng (Function)
export const FindAllFunction = (): Promise<
  AxiosResponse<FunctionsType[], any>
> => {
  return instance.post<FunctionsType[]>("/api/functions/list", formGetDataValue);
};
