package vn.tuhoc.vinaeatery.modules.auth.exceptions;

public class UserNotFoundByIdException extends RuntimeException {
    public UserNotFoundByIdException(Integer id) {
        super(String.format("Tài khoản có mã %s không tìm thấy!", id));
    }
}
