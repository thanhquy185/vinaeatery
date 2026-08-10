package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillDDetailResponseDTO;

@Component
@RequiredArgsConstructor
public class BillDetailMapperHelper {
    private final BillDetailMapper billDetailMapper;

    public BillDDetailResponseDTO mapToDetailResponse(BillDetailEntity billDetailEntity) {
        return this.billDetailMapper.entityToDetailResponse(billDetailEntity);
    }
}