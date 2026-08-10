package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.BillRepository;

@Component
@RequiredArgsConstructor
public class BillMapperHelper2 {
    private final BillRepository billRepository;
    private final BillMapper2 billMapper2;

    public BillEntity mapToEntity(Integer id) {
        return this.billRepository.findOneByIdToCrud(id).orElse(null);
    }

    public BillInfoResponseDTO mapToInfoResponse(BillEntity billEntity) {
        return this.billMapper2.entityToInfoResponse(billEntity);
    }
}