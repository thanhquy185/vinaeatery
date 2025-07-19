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
