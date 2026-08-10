package vn.tuhoc.vinaeatery.modules.active.exceptions;

public class BillNotFoundByIdException extends RuntimeException {
    public BillNotFoundByIdException(Integer id) {
        super(String.format("Hoá đơn có mã %s không tìm thấy!", id));
    }
}
