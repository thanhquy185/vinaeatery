package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketDetailEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.InputTicketDDetailResponseDTO;

@Component
@RequiredArgsConstructor
public class InputTicketDetailMapperHelper {
    private final InputTicketDetailMapper inputTicketDetailMapper;

    public InputTicketDDetailResponseDTO mapToDetailResponse(InputTicketDetailEntity inputTicketDetailEntity) {
        return this.inputTicketDetailMapper.entityToDetailResponse(inputTicketDetailEntity);
    }
}