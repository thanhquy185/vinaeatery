import type { SelectProps, UploadFile } from "antd";
import type { RcFile } from "antd/es/upload";

// Hàm định dạng việc hiển thị tiền VNĐ
export function vietnamMoneyFormat(money: number) {
  return money.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

// Hàm format và parse trường dữ liệu là số với input number
export function inputNumberFormatter(value: number | string = 0) {
  return value ? Number(value).toLocaleString("vi-VN") : "";
}
export function inputNumberParse(value: string = "0") {
  return Number(value?.replace(/[^\d]/g, "") || 0) as 0;
}

// Hàm đọc tiền theo kiểu Việt
export function numberToVietnamWords(n: number) {
  if (n === 0) return "Không đồng";

  let laSoAm = false;
  if (n < 0) {
    n *= -1;
    laSoAm = true;
  }

  const donVi = [
    "",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const hangChuc = [
    "",
    "mười",
    "hai mươi",
    "ba mươi",
    "bốn mươi",
    "năm mươi",
    "sáu mươi",
    "bảy mươi",
    "tám mươi",
    "chín mươi",
  ];
  const hangTram = [
    "",
    "một trăm",
    "hai trăm",
    "ba trăm",
    "bốn trăm",
    "năm trăm",
    "sáu trăm",
    "bảy trăm",
    "tám trăm",
    "chín trăm",
  ];

  const donViLon = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  function docBaChuSo(so: number, docDayDu = true) {
    let tram = Math.floor(so / 100);
    let chuc = Math.floor((so % 100) / 10);
    let donvi = so % 10;
    let result = "";

    if (tram > 0 || docDayDu) result += hangTram[tram] + " ";

    if (chuc > 1) {
      result += hangChuc[chuc] + " ";
      if (donvi === 1) result += "mốt";
      else if (donvi === 5) result += "lăm";
      else if (donvi > 0) result += donVi[donvi];
    } else if (chuc === 1) {
      result += "mười ";
      if (donvi === 5) result += "lăm";
      else if (donvi > 0) result += donVi[donvi];
    } else if (chuc === 0 && donvi > 0) {
      result += (tram > 0 ? "lẻ " : "") + donVi[donvi];
    }

    return result.trim();
  }

  function tachBaChuSo(n: number) {
    const result = [];
    while (n > 0) {
      result.push(n % 1000);
      n = Math.floor(n / 1000);
    }
    return result;
  }

  const cacNhom = tachBaChuSo(n); // mỗi phần tử là 3 chữ số
  let ketQua = "";

  for (let i = cacNhom.length - 1; i >= 0; i--) {
    const so = cacNhom[i];
    if (so > 0) {
      ketQua +=
        docBaChuSo(so, i !== cacNhom.length - 1) + " " + donViLon[i] + " ";
    } else {
      if (i === 0 && ketQua === "") ketQua = "không ";
    }
  }

  ketQua = ketQua.trim();
  if (laSoAm) return "Âm " + ketQua + " đồng";
  return ketQua.charAt(0).toUpperCase() + ketQua.slice(1) + " đồng";
}

// Hàm chuyển ngày tháng sang định dạng yyyy-mm-dd
export function formatDate1(date: Date) {
  let day = date.getDate().toString().padStart(2, "0");
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let year = date.getFullYear().toString().padStart(4, "0");
  return `${year}-${month}-${day}`;
}

// Hàm chuyển đường dẫn ảnh thành kiểu upload file
export const convertUrlsToUploadFiles = async (
  urls: string[],
): Promise<UploadFile[]> => {
  const results: UploadFile[] = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    // fetch ảnh
    const response = await fetch(url);
    const blob = await response.blob();

    // tạo file (RcFile)
    const file = new File([blob], `image-${i}.jpg`, {
      type: blob.type,
    }) as RcFile;

    results.push({
      uid: `${i}`,
      name: file.name,
      url,
      status: "done",
      originFileObj: file, // <--- QUAN TRỌNG
    });
  }

  return results;
};

export const getFilterSelectValueToShow = ({
  options,
  filterSelectValue,
}: {
  options: SelectProps["options"];
  filterSelectValue: string[] | null;
}) => {
  return filterSelectValue
    ? filterSelectValue.map((v) => ({
        label: options?.find((o) => o.value === v)?.label as string,
        value: v,
      }))
    : null;
};
