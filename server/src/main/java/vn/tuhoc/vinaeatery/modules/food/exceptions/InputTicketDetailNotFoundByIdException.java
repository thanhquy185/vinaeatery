package vn.tuhoc.vinaeatery.modules.food.exceptions;

import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketDetailIdEntity;

public class InputTicketDetailNotFoundByIdException extends RuntimeException {
    public InputTicketDetailNotFoundByIdException(InputTicketDetailIdEntity id) {
        super(String.format("Chi tiết phiếu nhập có mã phiếu nhập %s và mã nguyên liệu %s không tìm thấy!",
                id.getInputTicketId(), id.getIngredientId()));
    }
}
