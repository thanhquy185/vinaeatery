package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.OrderSheetNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.repositories.OrderSheetRepository;

@Component
@RequiredArgsConstructor
public class OrderSheetMapperHelper {
    private final OrderSheetRepository orderSheetRepository;
    private final OrderSheetMapper orderSheetMapper;

    public OrderSheetEntity mapToEntity(Integer id) {
        return this.orderSheetRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new OrderSheetNotFoundByIdException(id));
    }

    public OrderSheetDetailResponseDTO mapToDetailResponse(OrderSheetEntity orderSheetEntity) {
        return this.orderSheetMapper.entityToDetailResponse(orderSheetEntity);
    }

    public OrderSheetSummaryResponseDTO mapToSummaryResponse(OrderSheetEntity orderSheetEntity) {
        return this.orderSheetMapper.entityToSummaryResponse(orderSheetEntity);
    }

    public OrderSheetInfoResponseDTO mapToInfoResponse(OrderSheetEntity orderSheetEntity) {
        return this.orderSheetMapper.entityToInfoResponse(orderSheetEntity);
    }
}