package vn.tuhoc.vinaeatery.modules.auth.exceptions;

public class UserNotFoundByUsernameAndPasswordException extends RuntimeException {
    public UserNotFoundByUsernameAndPasswordException(String username, String password) {
        super(String.format("Tài khoản có tên tài khoản %s và mật khẩu %s không tìm thấy!", username, password));
    }
}
