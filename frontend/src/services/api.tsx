import type { AxiosResponse } from "axios";
import instance from "./customize";
import type { FilterDataProps } from "../common/props";
import type {
  CategoryFoodsType,
  CategoryIngredientsType,
  CategoryTablesType,
  CustomerCardsType,
  CustomersFormatType,
  CustomersType,
  EmployeesFormatType,
  EmployeesType,
  FloorsType,
  FoodsFormatType,
  FoodsType,
  FunctionsType,
  HandlePaymentsFormatType,
  HandlePaymentsType,
  IngredientsFormatType,
  IngredientsType,
  InputTicketsFormatType,
  InputTicketsType,
  ManagersFormatType,
  ManagersType,
  MessagesFormatType,
  MessagesType,
  OrdersFormatType,
  OrderSheetsFormatType,
  OrderSheetsType,
  OrdersType,
  OrderTablesFormatType,
  OrderTablesType,
  PayMethodsType,
  RestaurantsFormatType,
  RestaurantsType,
  RestResponseType,
  RolesFormatType,
  RolesType,
  SuppliersType,
  TablesFormatType,
  TablesType,
  UseFoodsFormatType,
  UseFoodsType,
  UsersType,
  UseTablesFormatType,
  UseTablesType,
} from "../common/types";

// Các key tương ứng cho từng đối tượng
const keys = {
  auth: "auth",
  momo: "momo",
  zalopay: "zalopay",
  messages: "messages",
  handlePayments: "handle-payments",
  users: "users",
  restaurants: "restaurants",
  managers: "managers",
  customers: "customers",
  categoryFoods: "category-foods",
  categoryIngredients: "category-ingredients",
  categoryTables: "category-tables",
  // customers: "customers",
  // customerCards: "customer-cards",
  employees: "employees",
  floors: "floors",
  foods: "foods",
  ingredients: "ingredients",
  inputTickets: "input-tickets",
  orders: "orders",
  orderSheets: "order-sheets",
  orderTables: "order-tables",
  roles: "roles",
  roleDetails: "role-details",
  suppliers: "suppliers",
  tables: "tables",
  useFoods: "use-foods",
  useTables: "use-tables",
  functions: "functions",
  payMethods: "pay-methods",
};
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
    email: "thanhquyfu@gmail.com",
  },
};
// Hàm tạo form bảo mật mới tương ứng với đối tượng
const getNewFormSecurityValue = ({
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

// Các api của đối tượng xác thực (Auth)
export const HandleSignUp = ({
  createAt,
  fullname,
  phone,
  email,
  username,
  password,
  authPassword,
}: {
  createAt: string;
  fullname: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  authPassword: string;
}): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.auth,
            fieldAction: "sign-up",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "sign-up",
    new Blob(
      [
        JSON.stringify({
          createAt,
          fullname,
          phone,
          email,
          username,
          password,
          authPassword,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(`/api/${keys.auth}/customer-sign-up`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLogin = ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.auth,
            fieldAction: "login",
          })
        ),
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
          password,
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
export const HandleLogout = (): Promise<
  AxiosResponse<RestResponseType, any>
> => {
  return instance.post(
    `/api/${keys.auth}/logout`,
    getNewFormSecurityValue({ fieldName: keys.auth, fieldAction: "logout" })
  );
};
export const HandleAccount = (): Promise<
  AxiosResponse<RestResponseType, any>
> => {
  return instance.post(
    `/api/${keys.auth}/account`,
    getNewFormSecurityValue({ fieldName: keys.auth, fieldAction: "account" })
  );
};

// Các api thanh toán hoá đơn
// - Momo
export const HandleCreateMomoOrder = (
  handlePaymentId: number
): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = new FormData();
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.momo,
            fieldAction: "create",
          })
        ),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(
    `/api/${keys.momo}/create/${handlePaymentId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
export const HandleCancelMomoOrder = ({
  orderId,
  amount,
}: {
  orderId: string;
  amount: string;
}): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.momo,
            fieldAction: "cancel",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Tổng thanh toán
  formData.append("amount", amount.toString());

  return instance.post(`/api/momo/cancel/${orderId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
// - Zalopay
export const HandleCreateZalopayOrder = (
  handlePaymentId: number
): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = new FormData();
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.zalopay,
            fieldAction: "create",
          })
        ),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(
    `/api/${keys.zalopay}/create/${handlePaymentId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// Các api xử lý thanh toán hoá đơn
export const GetHandlePayment = (): Promise<
  AxiosResponse<HandlePaymentsType, any>
> => {
  return instance.post(
    `/api/${keys.handlePayments}/get`,
    getNewFormSecurityValue({
      fieldName: keys.handlePayments,
      fieldAction: "read",
    })
  );
};
export const GetHandlePaymentFormat = (): Promise<
  AxiosResponse<HandlePaymentsFormatType, any>
> => {
  return instance.post(
    `/api/${keys.handlePayments}/get-format`,
    getNewFormSecurityValue({
      fieldName: keys.handlePayments,
      fieldAction: "read",
    })
  );
};
export const GetHandlePaymentByUseTableId = (
  useTableId: string
): Promise<AxiosResponse<HandlePaymentsType, any>> => {
  return instance.post(
    `/api/${keys.handlePayments}/get/${useTableId}`,
    getNewFormSecurityValue({
      fieldName: keys.handlePayments,
      fieldAction: "read",
    })
  );
};
export const GetHandlePaymentFormatByUseTableId = (
  useTableId: number
): Promise<AxiosResponse<HandlePaymentsFormatType, any>> => {
  return instance.post(
    `/api/${keys.handlePayments}/get-format/${useTableId}`,
    getNewFormSecurityValue({
      fieldName: keys.handlePayments,
      fieldAction: "read",
    })
  );
};
export const HandleUpdateHandlePayment = ({
  id,
  useTableId,
  employeeId,
  payMethodId,
  payTotalPrice,
  status,
}: HandlePaymentsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.handlePayments,
            fieldAction: "update",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "handle-payment",
    new Blob(
      [
        JSON.stringify({
          useTableId,
          employeeId,
          payMethodId,
          payTotalPrice,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.handlePayments}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Tài khoản (User)
export const FindAllUser = ({
  findType,
  findValue,
  roleValue,
  isUsingValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<UsersType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "username") params.username = findValue!;
  }
  if (roleValue! && roleValue!.length > 0) params.role = roleValue![0];
  if (isUsingValue! && isUsingValue!.length > 0)
    params.isUsing = isUsingValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<UsersType[]>(
    `/api/${keys.users}/list`,
    getNewFormSecurityValue({
      fieldName: keys.users,
      fieldAction: "read",
    }),
    { params }
  );
};
export const FindOneUser = (
  id: string
): Promise<AxiosResponse<UsersType, any>> => {
  return instance.post(
    `/api/${keys.users}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.users, fieldAction: "read" })
  );
};
export const HandleCreateUser = ({
  createAt,
  role,
  username,
  password,
  method,
  isUsing,
  status,
}: UsersType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.users,
      fieldAction: "create",
    }),
    user: {
      createAt,
      role,
      username,
      password,
      method,
      isUsing,
      status,
    },
  };
  console.log(formData);

  return instance.post(`/api/${keys.users}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateUser = ({
  id,
  role,
  // method,
  updateAt,
}: UsersType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.users,
      fieldAction: "update",
    }),
    user: {
      role,
      // method,
      updateAt,
    },
  };

  return instance.put(`/api/${keys.users}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleLockUser = ({
  id,
  status,
}: UsersType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.users,
      fieldAction: "lock",
    }),
    user: {
      status,
    },
  };

  return instance.patch(`/api/${keys.users}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleChangePasswordUser = ({
  id,
  newPassword,
  authNewPassword,
  updateAt,
}: {
  id?: number;
  newPassword?: string;
  authNewPassword?: string;
  updateAt?: string;
}): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.users,
      fieldAction: "change-password",
    }),
    user: {
      newPassword,
      authNewPassword,
      updateAt,
    },
  };

  return instance.put(`/api/${keys.users}/change-password/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Các api của đối tượng Nhà hàng (Restaurant)
export const FindAllRestaurant = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<RestaurantsFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<RestaurantsFormatType[]>(
    `/api/${keys.restaurants}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.restaurants,
      fieldAction: "read",
    })
  );
};
export const FindAllRestaurantByManagerId = ({
  managerId,
}: {
  managerId: number;
}): Promise<AxiosResponse<RestaurantsFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  // const params: Record<string, string> = {};
  // if (findValue! !== "") {
  //   if (findType! === "table") params.tableName = findValue!;
  // }
  // if (timeValue! && timeValue!.length > 0) {
  //   if (timeValue![0] !== "") params.timeStart = timeValue![0];
  //   if (timeValue![1] !== "") params.timeEnd = timeValue![1];
  // }
  // if (floorValue! && floorValue!.length > 0) params.floorId = floorValue![0];
  // if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<RestaurantsFormatType[]>(
    `/api/${keys.restaurants}/list-format-by-manager-id/${managerId}`,
    getNewFormSecurityValue({
      fieldName: keys.restaurants,
      fieldAction: "read",
    })
  );
};
export const FindAllRestaurantForPublicPage = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<RestaurantsFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<RestaurantsFormatType[]>(
    `/api/${keys.restaurants}/list-format-for-public-page`,
    getNewFormSecurityValue({
      fieldName: keys.restaurants,
      fieldAction: "read",
    })
  );
};
export const HandleCreateRestaurant = ({
  managerId,
  createAt,
  restaurantImages,
  name,
  phone,
  email,
  address,
  description,
  rating,
  status,
}: RestaurantsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.restaurants,
            fieldAction: "create",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "restaurant",
    new Blob(
      [
        JSON.stringify({
          managerId,
          createAt,
          name,
          phone,
          email,
          address,
          description,
          rating,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );
  // Hình ảnh
  if (restaurantImages) {
    restaurantImages?.forEach((restaurantImage) =>
      formData.append("restaurant-images", restaurantImage)
    );
  }

  return instance.post(`/api/${keys.restaurants}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateRestaurant = ({
  id,
  managerId,
  restaurantImages,
  name,
  phone,
  email,
  address,
  description,
  rating,
  updateAt,
}: RestaurantsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.restaurants,
            fieldAction: "update",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "restaurant",
    new Blob(
      [
        JSON.stringify({
          managerId,
          name,
          phone,
          email,
          address,
          description,
          rating,
          updateAt,
        }),
      ],
      { type: "application/json" }
    )
  );
  // Hình ảnh
  if (restaurantImages) {
    restaurantImages?.forEach((restaurantImage) =>
      formData.append("restaurant-images", restaurantImage)
    );
  }

  return instance.put(`/api/${keys.restaurants}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockRestaurant = ({
  id,
  status,
  updateAt,
}: RestaurantsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.restaurants,
            fieldAction: "lock",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "restaurant",
    new Blob(
      [
        JSON.stringify({
          status,
          updateAt,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.patch(`/api/${keys.restaurants}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Chủ nhà hàng (Manager)
export const FindAllManager = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<ManagersFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "fullname") params.fullname = findValue!;
    if (findType! === "phone") params.phone = findValue!;
    if (findType! === "email") params.email = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<ManagersFormatType[]>(
    `/api/${keys.managers}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.managers, fieldAction: "read" }),
    {
      params,
    }
  );
};
export const FindOneManager = (
  id: string
): Promise<AxiosResponse<ManagersFormatType, any>> => {
  return instance.post(
    `/api/${keys.managers}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.managers, fieldAction: "read" })
  );
};
// export const FindOneManagerByUserId = (
//   id: number
// ): Promise<AxiosResponse<ManagersFormatType, any>> => {
//   return instance.post(
//     `/api/${keys.managers}/detail-by-user-id/${id}`,
//     getNewFormSecurityValue({ fieldName: keys.managers, fieldAction: "read" })
//   );
// };
export const HandleCreateManager = ({
  userId,
  createAt,
  image,
  fullname,
  birthday,
  gender,
  phone,
  email,
  address,
  description,
  status,
}: ManagersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.managers,
            fieldAction: "create",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "manager",
    new Blob(
      [
        JSON.stringify({
          userId,
          createAt,
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
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.post(`/api/${keys.managers}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateManager = ({
  id,
  userId,
  image,
  fullname,
  birthday,
  gender,
  phone,
  email,
  address,
  description,
  updateAt,
}: ManagersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.managers,
            fieldAction: "update",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "manager",
    new Blob(
      [
        JSON.stringify({
          userId,
          fullname,
          birthday,
          gender,
          phone,
          email,
          address,
          description,
          updateAt,
        }),
      ],
      { type: "application/json" }
    )
  );
  if (image) formData.append("image-file", image);

  return instance.put(`/api/${keys.managers}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockManager = ({
  id,
  status,
  updateAt,
}: ManagersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.managers,
            fieldAction: "lock",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "manager",
    new Blob(
      [
        JSON.stringify({
          status,
          updateAt,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.patch(`/api/${keys.managers}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Khách hàng (Customer)
export const FindAllCustomer = ({
  findType,
  findValue,
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
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<CustomersFormatType[]>(
    `/api/${keys.customers}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.customers, fieldAction: "read" }),
    {
      params,
    }
  );
};
export const FindOneCustomer = (
  id: string
): Promise<AxiosResponse<CustomersFormatType, any>> => {
  return instance.post(
    `/api/${keys.customers}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.customers, fieldAction: "read" })
  );
};
// export const FindOneCustomerByUserId = (
//   id: number
// ): Promise<AxiosResponse<CustomersFormatType, any>> => {
//   return instance.post(
//     `/api/${keys.customers}/detail-by-user-id/${id}`,
//     getNewFormSecurityValue({ fieldName: keys.customers, fieldAction: "read" })
//   );
// };
export const HandleCreateCustomer = ({
  userId,
  createAt,
  image,
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

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.customers,
            fieldAction: "create",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "customer",
    new Blob(
      [
        JSON.stringify({
          userId,
          createAt,
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
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.post(`/api/${keys.customers}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateCustomer = ({
  id,
  userId,
  image,
  fullname,
  birthday,
  gender,
  phone,
  email,
  address,
  description,
  updateAt,
}: CustomersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.customers,
            fieldAction: "update",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "customer",
    new Blob(
      [
        JSON.stringify({
          userId,
          fullname,
          birthday,
          gender,
          phone,
          email,
          address,
          description,
          updateAt,
        }),
      ],
      { type: "application/json" }
    )
  );
  if (image) formData.append("image-file", image);

  return instance.put(`/api/${keys.customers}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockCustomer = ({
  id,
  status,
  updateAt,
}: CustomersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.customers,
            fieldAction: "lock",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "customer",
    new Blob(
      [
        JSON.stringify({
          status,
          updateAt,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.patch(`/api/${keys.customers}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Sử dụng bàn ăn (Use Table)
export const FindOneNewUseTableByTableId = ({
  restaurantId,
  tableId,
}: {
  restaurantId: string;
  tableId: string;
}): Promise<AxiosResponse<UseTablesFormatType, any>> => {
  return instance.post(
    `/api/${keys.useTables}/${restaurantId}/${tableId}`,
    getNewFormSecurityValue({ fieldName: keys.useTables, fieldAction: "read" })
  );
};
export const FindAllUseTable = ({
  findType,
  findValue,
  timeValue,
  floorValue,
  statusValue,
  restaurantId,
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
  if (floorValue! && floorValue!.length > 0) params.floorId = floorValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<UseTablesFormatType[]>(
    `/api/${keys.useTables}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.useTables, fieldAction: "read" }),
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
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<UseTablesFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "table") params.tableName = findValue!;
  }
  if (floorValue! && floorValue!.length > 0) params.floorId = floorValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<UseTablesFormatType[]>(
    `/api/${keys.useTables}/list-format?timeEnd=null`,
    getNewFormSecurityValue({ fieldName: keys.useTables, fieldAction: "read" }),
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
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.useTables,
            fieldAction: "update",
          })
        ),
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

// Các api liên quan đến nhắn tin
export const FindMessage = (): Promise<AxiosResponse<MessagesType[], any>> => {
  return instance.post(
    `/api/${keys.messages}/list`,
    getNewFormSecurityValue({
      fieldName: keys.messages,
      fieldAction: "read",
    })
  );
};
export const FindMessageFormat = ({
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<MessagesFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post(
    `/api/${keys.messages}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.messages,
      fieldAction: "read",
    }),
    { params }
  );
};
export const FindMessageFormatUseTableIsNull = ({
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<MessagesFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post(
    `/api/${keys.messages}/list-format?useTableTimeEnd=null`,
    getNewFormSecurityValue({
      fieldName: keys.messages,
      fieldAction: "read",
    }),
    { params }
  );
};

// Các api của đối tượng Sử dụng món ăn (Use Food)
export const FindAllUseFood = ({
  findType,
  findValue,
  timeValue,
  categoryValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<UseFoodsFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "food") params.foodName = findValue!;
  }
  if (timeValue! && timeValue!.length > 0) {
    if (timeValue![0] !== "") params.timeStart = timeValue![0];
    if (timeValue![1] !== "") params.timeEnd = timeValue![1];
  }
  if (categoryValue! && categoryValue!.length > 0)
    params.categoryFoodId = categoryValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<UseFoodsFormatType[]>(
    `/api/${keys.useFoods}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.useFoods, fieldAction: "read" }),
    {
      params,
    }
  );
};
export const FindAllUseFoodTimeEndIsNull = ({
  findType,
  findValue,
  categoryValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<UseFoodsFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "food") params.foodName = findValue!;
  }
  if (categoryValue! && categoryValue!.length > 0)
    params.categoryFoodId = categoryValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<UseFoodsFormatType[]>(
    `/api/${keys.useFoods}/list-format?timeEnd=null`,
    getNewFormSecurityValue({ fieldName: keys.useFoods, fieldAction: "read" }),
    {
      params,
    }
  );
};
export const HandleUpdateUseFood = ({
  id,
  timeEnd,
  employeeId,
  status,
}: UseFoodsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.useFoods,
            fieldAction: "update",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "use-food",
    new Blob(
      [
        JSON.stringify({
          timeEnd,
          employeeId,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.useFoods}/update/${id}`, formData, {
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
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<OrderSheetsFormatType[], any>> => {
  const params: Record<string, string> = {};

  // if (findValue! !== "") {
  //   if (findType! === "id") params.id = findValue!;
  //   if (findType! === "table") params.tableName = findValue!;
  // }
  // if (timeValue! && timeValue!.length > 0) {
  //   if (timeValue![0] !== "") params.createAtStart = timeValue![0];
  //   if (timeValue![1] !== "") params.createAtEnd = timeValue![1];
  // }
  if (floorValue! && floorValue!.length > 0) params.floorId = floorValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<OrderSheetsFormatType[]>(
    `/api/${keys.orderSheets}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.orderSheets,
      fieldAction: "read",
    }),
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
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<OrderSheetsFormatType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    // if (findType! === "id") params.id = findValue!;
    if (findType! === "table") params.tableName = findValue!;
  }
  if (floorValue! && floorValue!.length > 0) params.floorId = floorValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<OrderSheetsFormatType[]>(
    `/api/${keys.orderSheets}/list-format?currentDate`,
    getNewFormSecurityValue({
      fieldName: keys.orderSheets,
      fieldAction: "read",
    }),
    {
      params,
    }
  );
};
export const FindOneOrderSheet = (
  id: string
): Promise<AxiosResponse<OrderSheetsFormatType, any>> => {
  return instance.post(
    `/api/${keys.orderSheets}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.orderSheets,
      fieldAction: "read",
    })
  );
};
export const HandleCreateOrderSheet = ({
  restaurantId,
  createAt,
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
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.orderSheets,
            fieldAction: "create",
          })
        ),
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
          restaurantId,
          createAt,
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
  serviceAt,
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
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.orderSheets,
            fieldAction: "update",
          })
        ),
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
          serviceAt,
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
    if (timeValue![0] !== "") params.createAtStart = timeValue![0];
    if (timeValue![1] !== "") params.createAtEnd = timeValue![1];
  }
  if (statusValue! && statusValue!.length > 0)
    params.statusMerge = statusValue!.join(",");

  return instance.post<OrdersFormatType[]>(
    `/api/orders/list-format`,
    getNewFormSecurityValue({ fieldName: keys.orders, fieldAction: "read" }),
    {
      params,
    }
  );
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
  restaurantId,
  createAt,
  employeeId,
  customerId,
  totalPrice,
  payId,
  payTime,
  payMethodId,
  payTotalPrice,
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
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.orders,
            fieldAction: "create",
          })
        ),
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
          restaurantId,
          createAt,
          employeeId,
          customerId,
          totalPrice,
          payId,
          payTime,
          payMethodId,
          payTotalPrice,
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
export const HandleUpdateOrderStatus = ({
  id,
  status,
}: OrdersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.orders,
            fieldAction: "update",
          })
        ),
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
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.orders}/update-status/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateOrderPayStatus = ({
  id,
  payStatus,
}: OrdersType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.orders,
            fieldAction: "update",
          })
        ),
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
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.orders}/update-payment/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Các api của đối tượng Đơn đặt bàn (Order Table)
export const FindAllOrderTable = ({
  findType,
  findValue,
  arriveAtValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<OrderTablesFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "customer-id") params.customerId = findValue!;
    if (findType! === "customer-fullname") params.customerFullname = findValue!;
    if (findType! === "customer-phone") params.customerPhone = findValue!;
    if (findType! === "customer-email") params.customerEmail = findValue!;
  }
  if (arriveAtValue! && arriveAtValue!.length > 0) {
    if (arriveAtValue![0] !== "") params.arriveAtStart = arriveAtValue![0];
    if (arriveAtValue![1] !== "") params.arriveAtEnd = arriveAtValue![1];
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<OrderTablesFormatType[]>(
    `/api/${keys.orderTables}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.orderTables,
      fieldAction: "read",
    }),
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
    getNewFormSecurityValue({
      fieldName: keys.orderTables,
      fieldAction: "read",
    })
  );
};
export const HandleCreateOrderTable = ({
  restaurantId,
  employeeId,
  customerId,
  createAt,
  arriveAt,
  customerFullname,
  customerPhone,
  customerEmail,
  customerNote,
  guests,
  status,
}: OrderTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.orderTables,
            fieldAction: "create",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "order-table",
    new Blob(
      [
        JSON.stringify({
          restaurantId,
          employeeId,
          customerId,
          createAt,
          arriveAt,
          customerFullname,
          customerPhone,
          customerEmail,
          customerNote,
          guests,
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
  employeeId,
  status,
  updateAt,
}: OrderTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.orderTables,
            fieldAction: "update",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "order-table",
    new Blob(
      [
        JSON.stringify({
          employeeId,
          status,
          updateAt,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(
    `/api/${keys.orderTables}/update-status/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// Các api của đối tượng Tầng (Floor)
export const FindAllFloor = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<FloorsType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<FloorsType[]>(
    `/api/${keys.floors}/list`,
    getNewFormSecurityValue({ fieldName: keys.floors, fieldAction: "read" }),
    {
      params,
    }
  );
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
  restaurantId,
  name,
  description,
  status,
}: FloorsType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.floors,
      fieldAction: "create",
    }),
    floor: {
      restaurantId,
      name,
      description,
      status,
    },
  };

  return instance.post(`/api/${keys.floors}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateFloor = ({
  id,
  name,
  description,
}: FloorsType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.floors,
      fieldAction: "update",
    }),
    floor: {
      name,
      description,
    },
  };

  return instance.put(`/api/${keys.floors}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleLockFloor = ({
  id,
  status,
}: FloorsType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.floors,
      fieldAction: "lock",
    }),
    floor: {
      status,
    },
  };

  return instance.patch(`/api/${keys.floors}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Các api của đối tượng Loại bàn ăn (Category Table)
export const FindAllCategoryTable = ({
  findType,
  findValue,
  surchargeTypeValue,
  statusValue,
  restaurantId,
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
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<CategoryTablesType[]>(
    `/api/${keys.categoryTables}/list`,
    getNewFormSecurityValue({
      fieldName: keys.categoryTables,
      fieldAction: "read",
    }),
    {
      params,
    }
  );
};
export const FindOneCategoryTable = (
  id: string
): Promise<AxiosResponse<CategoryTablesType, any>> => {
  return instance.post(
    `/api/${keys.categoryTables}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.categoryTables,
      fieldAction: "read",
    })
  );
};
export const HandleCreateCategoryTable = ({
  restaurantId,
  name,
  surchargeType,
  surchargeValue,
  description,
  status,
}: CategoryTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryTables,
      fieldAction: "create",
    }),
    categoryTable: {
      restaurantId,
      name,
      surchargeType,
      surchargeValue,
      description,
      status,
    },
  };

  return instance.post(`/api/${keys.categoryTables}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateCategoryTable = ({
  id,
  name,
  surchargeType,
  surchargeValue,
  description,
}: CategoryTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryTables,
      fieldAction: "update",
    }),
    categoryTable: {
      name,
      surchargeType,
      surchargeValue,
      description,
    },
  };

  return instance.put(`/api/${keys.categoryTables}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleLockCategoryTable = ({
  id,
  status,
}: CategoryTablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryTables,
      fieldAction: "lock",
    }),
    categoryTable: {
      status,
    },
  };

  return instance.patch(`/api/${keys.categoryTables}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Các api của đối tượng Bàn ăn (Table)
export const FindAllTable = ({
  findType,
  findValue,
  categoryValue,
  statusValue,
  restaurantId,
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
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<TablesFormatType[]>(
    `/api/${keys.tables}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.tables, fieldAction: "read" }),
    {
      params,
    }
  );
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
  restaurantId,
  name,
  categoryTableId,
  floorId,
  seats,
  description,
  status,
}: TablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.tables,
      fieldAction: "create",
    }),
    table: {
      restaurantId,
      name,
      categoryTableId,
      floorId,
      seats,
      description,
      status,
    },
  };

  return instance.post(`/api/${keys.tables}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
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
}: TablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.tables,
      fieldAction: "update",
    }),
    table: {
      name,
      categoryTableId,
      floorId,
      seats,
      description,
    },
  };

  return instance.put(`/api/${keys.tables}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleLockTable = ({
  id,
  status,
}: TablesType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.tables,
      fieldAction: "lock",
    }),
    table: {
      status,
    },
  };

  return instance.patch(`/api/${keys.tables}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Các api của đối tượng Phiếu nhập (Input Ticket)
export const FindAllInputTicket = ({
  findType,
  findValue,
  timeValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<InputTicketsFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "supplier") params.supplierId = findValue!;
  }
  if (timeValue! && timeValue!.length > 0) {
    if (timeValue![0] !== "") params.createAtStart = timeValue![0];
    if (timeValue![1] !== "") params.createAtEnd = timeValue![1];
  }
  if (statusValue! && statusValue!.length > 0)
    params.statusMerge = statusValue!.join(",");
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<InputTicketsFormatType[]>(
    `/api/${keys.inputTickets}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.inputTickets,
      fieldAction: "read",
    }),
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
    getNewFormSecurityValue({
      fieldName: keys.inputTickets,
      fieldAction: "read",
    })
  );
};
export const HandleCreateInputTicket = ({
  restaurantId,
  employeeId,
  supplierId,
  totalPrice,
  payStatus,
  status,
  inputTicketDetails,
}: InputTicketsType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.inputTickets,
      fieldAction: "create",
    }),
    inputTicket: {
      restaurantId,
      employeeId,
      supplierId,
      totalPrice,
      payStatus,
      status,
    },
    inputTicketDetails,
  };

  return instance.post(`/api/${keys.inputTickets}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateInputTicket = ({
  id,
  payStatus,
  status,
}: InputTicketsType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.inputTickets,
      fieldAction: "update",
    }),
    inputTicket: {
      payStatus,
      status,
    },
  };

  return instance.put(`/api/${keys.inputTickets}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Các api của đối tượng Nhà cung cấp (Supplier)
export const FindAllSupplier = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
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
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<SuppliersType[]>(
    `/api/${keys.suppliers}/list`,
    getNewFormSecurityValue({ fieldName: keys.suppliers, fieldAction: "read" }),
    {
      params,
    }
  );
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
  restaurantId,
  name,
  phone,
  email,
  address,
  status,
}: SuppliersType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.suppliers,
      fieldAction: "create",
    }),
    supplier: {
      restaurantId,
      name,
      phone,
      email,
      address,
      status,
    },
  };

  return instance.post(`/api/${keys.suppliers}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateSupplier = ({
  id,
  name,
  phone,
  email,
  address,
}: SuppliersType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.suppliers,
      fieldAction: "update",
    }),
    supplier: {
      name,
      phone,
      email,
      address,
    },
  };

  return instance.put(`/api/${keys.suppliers}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleLockSupplier = ({
  id,
  status,
}: SuppliersType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.suppliers,
      fieldAction: "lock",
    }),
    supplier: {
      status,
    },
  };

  return instance.patch(`/api/${keys.suppliers}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Các api của đối tượng Loại nguyên liệu (Category Ingredient)
export const FindAllCategoryIngredient = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<CategoryIngredientsType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<CategoryIngredientsType[]>(
    `/api/${keys.categoryIngredients}/list`,
    getNewFormSecurityValue({
      fieldName: keys.categoryIngredients,
      fieldAction: "read",
    }),
    {
      params,
    }
  );
};
export const FindOneCategoryIngredient = (
  id: string
): Promise<AxiosResponse<CategoryIngredientsType, any>> => {
  return instance.post(
    `/api/${keys.categoryIngredients}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.categoryIngredients,
      fieldAction: "read",
    })
  );
};
export const HandleCreateCategoryIngredient = ({
  restaurantId,
  name,
  description,
  status,
}: CategoryIngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryIngredients,
      fieldAction: "create",
    }),
    categoryIngredient: {
      restaurantId,
      name,
      description,
      status,
    },
  };

  return instance.post(`/api/${keys.categoryIngredients}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateCategoryIngredient = ({
  id,
  name,
  description,
}: CategoryIngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryIngredients,
      fieldAction: "update",
    }),
    categoryIngredient: {
      name,
      description,
    },
  };

  return instance.put(
    `/api/${keys.categoryIngredients}/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
export const HandleLockCategoryIngredient = ({
  id,
  status,
}: CategoryIngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryIngredients,
      fieldAction: "lock",
    }),
    categoryIngredient: {
      status,
    },
  };

  return instance.patch(
    `/api/${keys.categoryIngredients}/lock/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

// Các api của đối tượng Nguyên liệu (Ingredient)
export const FindAllIngredient = ({
  findType,
  findValue,
  categoryValue,
  statusValue,
  restaurantId,
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
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<IngredientsFormatType[]>(
    `/api/${keys.ingredients}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.ingredients,
      fieldAction: "read",
    }),
    {
      params,
    }
  );
};
export const FindOneIngredient = (
  id: string
): Promise<AxiosResponse<IngredientsFormatType, any>> => {
  return instance.post(
    `/api/${keys.ingredients}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.ingredients,
      fieldAction: "read",
    })
  );
};
export const HandleCreateIngredient = ({
  restaurantId,
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
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.ingredients,
      fieldAction: "create",
    }),
    ingredient: {
      restaurantId,
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
    },
  };

  return instance.post(`/api/${keys.ingredients}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
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
  updateAt,
}: IngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.ingredients,
      fieldAction: "update",
    }),
    ingredient: {
      name,
      categoryIngredientId,
      unit,
      capacity,
      dateCreate,
      dateRemove,
      inputPrice,
      note,
      updateAt,
    },
  };

  return instance.put(`/api/${keys.ingredients}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleLockIngredient = ({
  id,
  status,
}: IngredientsType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.ingredients,
      fieldAction: "lock",
    }),
    ingredient: {
      status,
    },
  };

  return instance.patch(`/api/${keys.ingredients}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Các api của đối tượng Loại món ăn (Category Food)
export const FindAllCategoryFood = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<CategoryFoodsType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<CategoryFoodsType[]>(
    `/api/${keys.categoryFoods}/list`,
    getNewFormSecurityValue({
      fieldName: keys.categoryFoods,
      fieldAction: "read",
    }),
    {
      params,
    }
  );
};
export const FindOneCategoryFood = (
  id: string
): Promise<AxiosResponse<CategoryFoodsType, any>> => {
  return instance.post(
    `/api/${keys.categoryFoods}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.categoryFoods,
      fieldAction: "read",
    })
  );
};
export const HandleCreateCategoryFood = ({
  restaurantId,
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
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.categoryFoods,
            fieldAction: "create",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "category-food",
    new Blob(
      [
        JSON.stringify({
          restaurantId,
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
  updateAt,
}: CategoryFoodsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.categoryFoods,
            fieldAction: "update",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "category-food",
    new Blob(
      [
        JSON.stringify({
          name,
          description,
          updateAt,
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
  updateAt,
}: CategoryFoodsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.categoryFoods,
            fieldAction: "lock",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "category-food",
    new Blob(
      [
        JSON.stringify({
          status,
          updateAt,
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
  restaurantId,
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
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<FoodsFormatType[]>(
    `/api/${keys.foods}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.foods, fieldAction: "read" }),
    {
      params,
    }
  );
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
  restaurantId,
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
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.foods,
            fieldAction: "create",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "food",
    new Blob(
      [
        JSON.stringify({
          restaurantId,
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
  updateAt,
  recipe,
}: FoodsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.foods,
            fieldAction: "update",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
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
          updateAt,
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
  updateAt,
}: FoodsType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.foods,
            fieldAction: "lock",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "food",
    new Blob(
      [
        JSON.stringify({
          status,
          updateAt,
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
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<RolesFormatType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<RolesFormatType[]>(
    `/api/${keys.roles}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.roles, fieldAction: "read" }),
    {
      params,
    }
  );
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
  restaurantId,
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
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.roles,
            fieldAction: "create",
          })
        ),
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
          restaurantId,
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
  updateAt,
  roleDetails,
}: RolesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.roles,
            fieldAction: "update",
          })
        ),
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
          updateAt,
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
  updateAt,
}: RolesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.roles,
            fieldAction: "lock",
          })
        ),
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
          updateAt,
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
  restaurantId,
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
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<EmployeesFormatType[]>(
    `/api/${keys.employees}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.employees, fieldAction: "read" }),
    {
      params,
    }
  );
};
export const FindOneEmployee = (
  id: string
): Promise<AxiosResponse<EmployeesType, any>> => {
  return instance.post(
    `/api/${keys.employees}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.employees, fieldAction: "read" })
  );
};
// export const FindOneEmployeeByUserId = (
//   id: number
// ): Promise<AxiosResponse<EmployeesFormatType, any>> => {
//   return instance.post(
//     `/api/${keys.employees}/detail-by-user-id/${id}`,
//     getNewFormSecurityValue({ fieldName: keys.employees, fieldAction: "read" })
//   );
// };
export const HandleCreateEmployee = ({
  restaurantId,
  createAt,
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
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.employees,
            fieldAction: "create",
          })
        ),
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
          restaurantId,
          createAt,
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
  updateAt,
}: EmployeesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.employees,
            fieldAction: "update",
          })
        ),
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
          updateAt,
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
  updateAt,
}: EmployeesType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.employees,
            fieldAction: "lock",
          })
        ),
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
          updateAt,
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
  updateAt,
}: {
  id?: number;
  currentPassword?: string;
  newPassword?: string;
  authNewPassword?: string;
  updateAt?: string;
}): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.employees,
            fieldAction: "change-password",
          })
        ),
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
          updateAt,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(
    `/api/${keys.employees}/change-password/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
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

// Các api của đối tượng Phương thức thanh toán (Pay Method)
export const FindAllPayMethod = (): Promise<
  AxiosResponse<PayMethodsType[], any>
> => {
  return instance.post<PayMethodsType[]>(
    `/api/${keys.payMethods}/list`,
    getNewFormSecurityValue({ fieldName: keys.payMethods, fieldAction: "read" })
  );
};
