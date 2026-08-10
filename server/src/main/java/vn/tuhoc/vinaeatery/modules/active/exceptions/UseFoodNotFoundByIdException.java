package vn.tuhoc.vinaeatery.modules.active.exceptions;

public class UseFoodNotFoundByIdException extends RuntimeException {
    public UseFoodNotFoundByIdException(Integer id) {
        super(String.format("Sử dụng món ăn có mã %s không tìm thấy!", id));
    }
}
