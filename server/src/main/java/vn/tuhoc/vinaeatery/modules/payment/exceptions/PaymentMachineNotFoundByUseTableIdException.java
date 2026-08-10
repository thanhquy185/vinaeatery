package vn.tuhoc.vinaeatery.modules.payment.exceptions;

public class PaymentMachineNotFoundByUseTableIdException extends RuntimeException {
    public PaymentMachineNotFoundByUseTableIdException(Integer useTableId) {
        super(String.format("Thanh toán POS có mã sử dụng bàn ăn %s không tìm thấy!", useTableId));
    }
}
