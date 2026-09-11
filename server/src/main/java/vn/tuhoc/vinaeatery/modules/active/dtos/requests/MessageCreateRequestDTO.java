package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    Integer restaurantId;

    @NotNull(message = "Mã sử dụng bàn ăn không được để trống!")
    Long useTableId;

    String createAt;

    Boolean isRead;

    List<MessageDetailCreateRequestDTO> messageDetails;
}
