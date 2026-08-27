package vn.tuhoc.vinaeatery.modules.auth.exceptions;

public class AuthSessionNotFoundByRefreshTokenException extends RuntimeException {
    public AuthSessionNotFoundByRefreshTokenException() {
        super("Mã refresh token chưa bị thu hồi của người dùng không tìm thấy!");
    }
}
