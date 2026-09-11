package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketDetailEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.InputTicketDDetailResponseDTO;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InputTicketDetailMapperHelper {
    final InputTicketDetailMapper inputTicketDetailMapper;

    public InputTicketDDetailResponseDTO mapToDetailResponse(InputTicketDetailEntity inputTicketDetailEntity) {
        return this.inputTicketDetailMapper.entityToDetailResponse(inputTicketDetailEntity);
    }
}