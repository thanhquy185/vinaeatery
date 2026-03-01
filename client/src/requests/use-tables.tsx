import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { UseTableType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Sử dụng bàn ăn (Use Table)
export const FindOneNewUseTableByTableId = ({
  restaurantId,
  tableId,
}: FilterDataProps): Promise<AxiosResponse<UseTableType, any>> => {
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
}: FilterDataProps): Promise<AxiosResponse<UseTableType[], any>> => {
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

  return instance.post<UseTableType[]>(
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
}: FilterDataProps): Promise<AxiosResponse<UseTableType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "table") params.tableName = findValue!;
  }
  if (floorValue! && floorValue!.length > 0) params.floorId = floorValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<UseTableType[]>(
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
  customerFullname,
  customerPhone,
  customerEmail,
  orderId,
  orderTableId,
  orderTableNewFullname,
  orderTableNewPhone,
  orderTableNewEmail,
  orderTableNewAddress,
  status,
  orderSheets,
}: UseTableType): Promise<AxiosResponse<RestResponseType, any>> => {
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
          customerFullname,
          customerPhone,
          customerEmail,
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
