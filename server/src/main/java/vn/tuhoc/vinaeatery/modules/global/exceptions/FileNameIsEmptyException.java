package vn.tuhoc.vinaeatery.modules.global.exceptions;

public class FileNameIsEmptyException extends RuntimeException {
    public FileNameIsEmptyException() {
        super("File name is empty");
    }
}
