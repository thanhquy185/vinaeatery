package vn.tuhoc.vinaeatery.modules.auth.exceptions;

public class UserPasswordIsUsingException extends RuntimeException {
    public UserPasswordIsUsingException(String newPassword) {
        super(String.format("Mật khẩu %s đang được sử dụng!", newPassword));
    }
}
