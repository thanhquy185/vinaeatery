package vn.tuhoc.vinaeatery.modules.auth.exceptions;

public class UserNotFoundByUsernameException extends RuntimeException {
    public UserNotFoundByUsernameException(String username) {
        super(String.format("Tài khoản có tên tài khoản %s không tìm thấy!", username));
    }
}
