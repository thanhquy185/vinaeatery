package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MessageCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;

    @NotNull(message = "Mã sử dụng bàn ăn không được để trống!")
    private Long useTableId;

    private String createAt;

    private Boolean isRead;

    private List<MessageDetailCreateRequestDTO> messageDetails;
}
