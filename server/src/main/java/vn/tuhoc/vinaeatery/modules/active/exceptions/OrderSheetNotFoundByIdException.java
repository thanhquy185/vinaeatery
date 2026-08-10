package vn.tuhoc.vinaeatery.modules.active.exceptions;

public class OrderSheetNotFoundByIdException extends RuntimeException {
    public OrderSheetNotFoundByIdException(Integer id) {
        super(String.format("Phiếu gọi món có mã %s không tìm thấy!", id));
    }
}
