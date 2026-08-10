package vn.tuhoc.vinaeatery.modules.auth.exceptions;

public class AuthUserIsLockingException extends RuntimeException {
    public AuthUserIsLockingException() {
        super("Tài khoản đang bị khoá, không thể đăng nhập!");
    }
}
