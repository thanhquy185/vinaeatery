import React, { useState } from "react";

// Các giá trị chung
// - Trạng thái
const confirm = "Đã đặt chỗ";
const fix = "Đang bảo trì";
const pending = "Đang trống";

type CustomSeatPickerProps = {
  id: number;
  row: string;
  number: number;
  image?: string;
  type?: string;
  selected?: boolean;
  reserved?: boolean;
} | null;

const rowsData: CustomSeatPickerProps[][] = [
  [
    {
      id: 1,
      row: "A",
      number: 1,
      image: "/src/assets/images/category-seats/1718184812345-1.png",
      type: "original",
    },
    // { id: 2, row: "A", number: 2, image: "/src/assets/images/category-seats/1.png", type: "original", reserved: true },
    null,
    {
      id: 3,
      row: "A",
      number: 3,
      image: "/src/assets/images/category-seats/1718184812345-2.png",
      type: "original",
      selected: true,
    },
  ],
  [
    {
      id: 4,
      row: "B",
      number: 1,
      image: "/src/assets/images/category-seats/1718184812345-3.png",
      type: "original",
    },
    {
      id: 5,
      row: "B",
      number: 2,
      image: "/src/assets/images/category-seats/1718184812345-4.png",
      type: "original",
    },
    {
      id: 6,
      row: "B",
      number: 3,
      image: "/src/assets/images/category-seats/1718184812345-1.png",
      type: "original",
      reserved: true,
    },
  ],
  [
    {
      id: 7,
      row: "C",
      number: 1,
      image: "/src/assets/images/category-seats/1718184812345-1.png",
      type: "vip",
    },
    {
      id: 8,
      row: "C",
      number: 2,
      image: "/src/assets/images/category-seats/1718184812345-1.png",
      type: "vip",
    },
    {
      id: 9,
      row: "C",
      number: 3,
      image: "/src/assets/images/category-seats/1718184812345-1.png",
      type: "vip",
    },
  ],
];

const MAX_SELECT = 3;

const CustomSeatPicker: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<CustomSeatPickerProps[]>(
    []
  );

  const handleClick = (seat: CustomSeatPickerProps) => {
    if (seat!.reserved) return;

    const isSelected = selectedSeats.some((s) => s!.id === seat!.id);

    if (isSelected) {
      setSelectedSeats((prev) => prev.filter((s) => s!.id !== seat!.id));
    } else {
      // if (selectedSeats.length >= MAX_SELECT) return;
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  //   const getSeatImage = (seat: CustomSeatPickerProps): string => {
  //     if (seat!.reserved) return "/src/assets/images/category-seats/sofa.png";
  //     if (selectedSeats.some((s) => s!.id === seat!.id))
  //       return "/src/assets/images/category-seats/sofa.png";
  //     return "/src/assets/images/category-seats/sofa.png";
  //   };

  return (
    <div className="seat-picker">
      {rowsData.map((row, rowIndex) => (
        <div key={rowIndex} className="seat-row">
          {row.map((seat, seatIndex) =>
            seat ? (
              <button
                key={seat.id}
                type="button"
                className={
                  "seat-item" +
                  (selectedSeats.some((s) => s!.id === seat!.id)
                    ? " active"
                    : "") +
                  (seat.type ? " " + seat.type + " " : "") +
                  (seat.selected ? " selected" : "") +
                  (seat.reserved ? " reserved" : "")
                }
                onClick={() => handleClick(seat)}
              >
                <img src={seat.image} alt={`seat-${seat.row}-${seat.number}`} />
                <p>
                  {seat.row}
                  {seat.number >= 10 ? seat.number : "0" + seat.number}
                </p>
              </button>
            ) : (
              <div
                key={`empty-${rowIndex}-${seatIndex}`}
                className="seat-item empty"
              />
            )
          )}
        </div>
      ))}
      <p className="info">
        Bạn đã chọn:{" "}
        {selectedSeats.map((s) => `${s!.row}${s!.number}`).join(", ")}
      </p>
    </div>
  );
};

export default CustomSeatPicker;
