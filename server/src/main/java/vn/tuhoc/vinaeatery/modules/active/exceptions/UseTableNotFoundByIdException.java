package vn.tuhoc.vinaeatery.modules.active.exceptions;

public class UseTableNotFoundByIdException extends RuntimeException {
    public UseTableNotFoundByIdException(Long id) {
        super(String.format("Sử dụng bàn ăn có mã %s không tìm thấy!", id));
    }
}
