package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetDDetailResponseDTO;

@Component
@RequiredArgsConstructor
public class OrderSheetDetailMapperHelper {
    private final OrderSheetDetailMapper orderSheetDetailMapper;

    public OrderSheetDDetailResponseDTO mapToDetailResponse(OrderSheetDetailEntity orderSheetDetailEntity) {
        return this.orderSheetDetailMapper.entityToDetailResponse(orderSheetDetailEntity);
    }
}