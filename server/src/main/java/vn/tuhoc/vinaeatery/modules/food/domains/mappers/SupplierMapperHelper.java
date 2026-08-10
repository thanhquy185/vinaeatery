package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.SupplierEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.exceptions.SupplierNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.repositories.SupplierRepository;

@Component
@RequiredArgsConstructor
public class SupplierMapperHelper {
    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    public SupplierEntity mapToEntity(Integer id) {
        return this.supplierRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new SupplierNotFoundByIdException(id));
    }

    public SupplierDetailResponseDTO mapToDetailResponse(SupplierEntity supplierEntity) {
        return this.supplierMapper.entityToDetailResponse(supplierEntity);
    }

    public SupplierSummaryResponseDTO mapToSummaryResponse(SupplierEntity supplierEntity) {
        return this.supplierMapper.entityToSummaryResponse(supplierEntity);
    }

    public SupplierCrudResponseDTO mapToCrudResponse(SupplierEntity supplierEntity) {
        return this.supplierMapper.entityToCrudResponse(supplierEntity);
    }

    public SupplierInfoResponseDTO mapToInfoResponse(SupplierEntity supplierEntity) {
        return this.supplierMapper.entityToInfoResponse(supplierEntity);
    }
}