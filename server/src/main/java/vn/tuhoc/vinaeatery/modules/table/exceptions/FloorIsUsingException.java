package vn.tuhoc.vinaeatery.modules.table.exceptions;

public class FloorIsUsingException extends RuntimeException {

    public FloorIsUsingException(Integer id) {
        super(String.format("Tầng có mã %s đang được sử dụng!", id));
    }
}
