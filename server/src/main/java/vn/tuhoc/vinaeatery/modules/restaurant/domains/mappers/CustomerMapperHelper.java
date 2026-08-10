package vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.CustomerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.CustomerNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.CustomerRepository;

@Component
@RequiredArgsConstructor
public class CustomerMapperHelper {
    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public CustomerEntity mapToEntity(Integer id) {
        return this.customerRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new CustomerNotFoundByIdException(id));
    }

    public CustomerDetailResponseDTO mapToDetailResponse(CustomerEntity customerEntity) {
        return this.customerMapper.entityToDetailResponse(customerEntity);
    }

    public CustomerSummaryResponseDTO mapToSummaryResponse(CustomerEntity customerEntity) {
        return this.customerMapper.entityToSummaryResponse(customerEntity);
    }

    public CustomerCrudResponseDTO mapToCrudResponse(CustomerEntity customerEntity) {
        return this.customerMapper.entityToCrudResponse(customerEntity);
    }

    public CustomerInfoResponseDTO mapToInfoResponse(CustomerEntity customerEntity) {
        return this.customerMapper.entityToInfoResponse(customerEntity);
    }
}