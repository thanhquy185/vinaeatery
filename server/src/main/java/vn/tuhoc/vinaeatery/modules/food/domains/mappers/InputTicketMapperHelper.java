package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.InputTicketDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.InputTicketSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.exceptions.InputTicketNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.repositories.InputTicketRepository;

@Component
@RequiredArgsConstructor
public class InputTicketMapperHelper {
    private final InputTicketRepository inputTicketRepository;
    private final InputTicketMapper inputTicketMapper;

    public InputTicketEntity mapToEntity(Integer id) {
        return this.inputTicketRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new InputTicketNotFoundByIdException(id));
    }

    public InputTicketDetailResponseDTO mapToDetailResponse(InputTicketEntity inputTicketEntity) {
        return this.inputTicketMapper.entityToDetailResponse(inputTicketEntity);
    }

    public InputTicketSummaryResponseDTO mapToSummaryResponse(InputTicketEntity inputTicketEntity) {
        return this.inputTicketMapper.entityToSummaryResponse(inputTicketEntity);
    }
}