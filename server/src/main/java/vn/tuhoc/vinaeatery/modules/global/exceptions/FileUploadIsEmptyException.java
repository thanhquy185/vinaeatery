package vn.tuhoc.vinaeatery.modules.global.exceptions;

public class FileUploadIsEmptyException extends RuntimeException {
    public FileUploadIsEmptyException() {
        super("File upload is empty");
    }
}
