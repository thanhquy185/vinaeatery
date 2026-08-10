package vn.tuhoc.vinaeatery.modules.food.exceptions;

public class InputTicketNotFoundByIdException extends RuntimeException {
    public InputTicketNotFoundByIdException(Integer id) {
        super(String.format("Phiếu nhập có mã %s không tìm thấy!", id));
    }
}
