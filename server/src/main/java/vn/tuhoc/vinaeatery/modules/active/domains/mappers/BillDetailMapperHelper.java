package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillDDetailResponseDTO;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillDetailMapperHelper {
    final BillDetailMapper billDetailMapper;

    public BillDDetailResponseDTO mapToDetailResponse(BillDetailEntity billDetailEntity) {
        return this.billDetailMapper.entityToDetailResponse(billDetailEntity);
    }
}