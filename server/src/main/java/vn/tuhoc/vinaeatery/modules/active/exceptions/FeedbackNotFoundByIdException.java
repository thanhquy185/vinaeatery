package vn.tuhoc.vinaeatery.modules.active.exceptions;

public class FeedbackNotFoundByIdException extends RuntimeException {
    public FeedbackNotFoundByIdException(Integer id) {
        super(String.format("Đánh giá có mã %s không tìm thấy!", id));
    }
}
