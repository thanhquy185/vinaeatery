package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.BillNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.repositories.BillRepository;

@Component
@RequiredArgsConstructor
public class BillMapperHelper {
    private final BillRepository billRepository;
    private final BillMapper billMapper;

    public BillEntity mapToEntity(Integer id) {
        return this.billRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new BillNotFoundByIdException(id));
    }

    public BillDetailResponseDTO mapToDetailResponse(BillEntity billEntity) {
        return this.billMapper.entityToDetailResponse(billEntity);
    }

    public BillSummaryResponseDTO mapToSummaryResponse(BillEntity billEntity) {
        return this.billMapper.entityToSummaryResponse(billEntity);
    }

    public BillCustomerResponseDTO mapToCustomerResponse(BillEntity billEntity) {
        return this.billMapper.entityToCustomerResponse(billEntity);
    }

    public BillInfoResponseDTO mapToInfoResponse(BillEntity billEntity) {
        return this.billMapper.entityToInfoResponse(billEntity);
    }
}