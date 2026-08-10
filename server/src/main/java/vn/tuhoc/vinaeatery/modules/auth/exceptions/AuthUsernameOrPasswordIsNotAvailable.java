package vn.tuhoc.vinaeatery.modules.auth.exceptions;

public class AuthUsernameOrPasswordIsNotAvailable extends RuntimeException {
    public AuthUsernameOrPasswordIsNotAvailable() {
        super("Tên tài khoản hoặc mật khẩu không đúng!");
    }
}
