package vn.tuhoc.vinaeatery.modules.active.exceptions;

public class ReservationNotFoundByIdException extends RuntimeException {
    public ReservationNotFoundByIdException(Integer id) {
        super(String.format("Đặt bàn có mã %s không tìm thấy!", id));
    }
}
