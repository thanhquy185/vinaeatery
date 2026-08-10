package vn.tuhoc.vinaeatery.modules.active.exceptions;

public class MessageNotFoundByIdException extends RuntimeException {
    public MessageNotFoundByIdException(Integer id) {
        super(String.format("Trò chuyện có mã %s không tìm thấy!", id));
    }
}
