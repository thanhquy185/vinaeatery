package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageDetailResponseDTO {
    Integer id;

    RestaurantSubInfoResponseDTO restaurant;

    UseTableInfoResponseDTO useTable;

    String createAt;

    Boolean isRead;

    List<MessageDDetailResponseDTO> messageDetails;
}
