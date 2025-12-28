import type { UploadFile } from "antd";
import {
  filterMonth,
  filterQuarter,
  filterYear,
} from "../components/admin-manager/filter-dashboard";
import type { RcFile } from "antd/es/upload";

// Hàm định dạng việc hiển thị tiền VNĐ
export function vietnamMoneyFormat(money: number) {
  return money.toLocaleString("vi-VN");
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

// Hàm lấy ra danh sách các tuần trong tháng
export function getWeeksInMonth(year: number, month: number) {
  // Chuyển tháng về dạng 0-11 cho JS
  month = month - 1;

  let weeks = [];
  // Ngày đầu tháng
  let firstDay = new Date(year, month, 1);
  // Ngày cuối tháng
  let lastDay = new Date(year, month + 1, 0);
  // Ngày duyệt hiện tại
  let current = new Date(firstDay);

  while (current <= lastDay) {
    // Ngày đầu tuần
    let startOfWeek = new Date(current);
    // Ngày cuối tuần
    let endOfWeek = new Date(current);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Đảm bảo endOfWeek không vượt quá ngày cuối tháng
    if (endOfWeek > lastDay) {
      endOfWeek = lastDay;
    }

    // Thêm vào danh sách
    weeks.push({
      week: weeks.length + 1,
      start: formatDate1(startOfWeek),
      end: formatDate1(endOfWeek),
    });

    // Chuyển sang ngày đầu tiên của tuần tiếp theo
    current.setDate(current.getDate() + 7);
  }

  return weeks;
}

// Hàm lấy ra danh sách các tuần trong quý
export function getWeeksInQuarter(year: number, quarter: number) {
  const startMonth = (quarter - 1) * 3; // Tháng bắt đầu quý (0-based)
  const endMonth = startMonth + 2; // Tháng kết thúc quý

  const firstDay = new Date(year, startMonth, 1); // Ngày đầu quý
  const lastDay = new Date(year, endMonth + 1, 0); // Ngày cuối quý (ngày 0 của tháng tiếp theo)

  const weeks = [];
  let current = new Date(firstDay);

  while (current <= lastDay) {
    let startOfWeek = new Date(current);
    let endOfWeek = new Date(current);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    if (endOfWeek > lastDay) {
      endOfWeek = lastDay;
    }

    weeks.push({
      week: weeks.length + 1,
      start: formatDate1(startOfWeek),
      end: formatDate1(endOfWeek),
    });

    current.setDate(current.getDate() + 7);
  }

  return weeks;
}

// Hàm lấy ra danh sách các tháng trong năm
export function getMonthsInYear(year: number) {
  let months = [];

  for (let month = 0; month < 12; month++) {
    // Ngày đầu tháng
    let start = new Date(year, month, 1);
    // Ngày cuối tháng
    let end = new Date(year, month + 1, 0);

    // Thêm vào danh sách
    months.push({
      month: month + 1,
      start: formatDate1(start),
      end: formatDate1(end),
    });
  }

  return months;
}

// Hàm lấy ra loại thời gian tương ứng ở chức năng thống kê
export function getFilterTimesForDashboard(
  timeline: string,
  timeDetail: string
) {
  if (
    timeline === filterYear &&
    timeDetail.toLocaleLowerCase().includes("năm")
  ) {
    const months = getMonthsInYear(Number(timeDetail.split(" ")[1]));
    return months;
  } else if (
    timeline === filterQuarter &&
    timeDetail.toLocaleLowerCase().includes("quý")
  ) {
    const variables = timeDetail.split(" ")[1].split("/");
    const weeks = getWeeksInQuarter(Number(variables[1]), Number(variables[0]));
    return weeks;
  } else if (
    timeline === filterMonth &&
    timeDetail.toLocaleLowerCase().includes("tháng")
  ) {
    const variables = timeDetail.split(" ")[1].split("/");
    const weeks = getWeeksInMonth(Number(variables[1]), Number(variables[0]));
    return weeks;
  }

  return null;
}

// Hàm chuyển đường dẫn ảnh thành kiểu upload file
export const convertUrlsToUploadFiles = async (urls: string[]): Promise<UploadFile[]> => {
  const results: UploadFile[] = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    // fetch ảnh
    const response = await fetch(url);
    const blob = await response.blob();

    // tạo file (RcFile)
    const file = new File([blob], `image-${i}.jpg`, { type: blob.type }) as RcFile;

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

