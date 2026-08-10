package vn.tuhoc.vinaeatery.modules.payment.exceptions;

public class ZaloPayTransactionInavailableException extends RuntimeException {
    public ZaloPayTransactionInavailableException() {
        super("Giao dịch không tồn tại!");
    }
}
