package vn.tuhoc.vinaeatery.modules.auth.exceptions;

public class UserNotFoundByUsernameAndRefreshTokenException extends RuntimeException {
    public UserNotFoundByUsernameAndRefreshTokenException(String username, String refreshToken) {
        super(String.format("Tài khoản có tên tài khoản %s và mã token %s không tìm thấy!", username, refreshToken));
    }
}
