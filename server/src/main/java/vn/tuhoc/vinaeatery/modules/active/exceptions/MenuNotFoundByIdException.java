package vn.tuhoc.vinaeatery.modules.active.exceptions;

public class MenuNotFoundByIdException extends RuntimeException {
    public MenuNotFoundByIdException(Integer id) {
        super(String.format("Thực đơn có mã %s không tìm thấy!", id));
    }
}
