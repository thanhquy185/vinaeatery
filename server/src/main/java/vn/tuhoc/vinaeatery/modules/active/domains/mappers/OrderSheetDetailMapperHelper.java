package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetDDetailResponseDTO;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderSheetDetailMapperHelper {
    final OrderSheetDetailMapper orderSheetDetailMapper;

    public OrderSheetDDetailResponseDTO mapToDetailResponse(OrderSheetDetailEntity orderSheetDetailEntity) {
        return this.orderSheetDetailMapper.entityToDetailResponse(orderSheetDetailEntity);
    }
}