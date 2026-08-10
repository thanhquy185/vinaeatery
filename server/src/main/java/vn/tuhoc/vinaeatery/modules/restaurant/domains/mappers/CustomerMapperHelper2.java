package vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.CustomerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.CustomerRepository;

@Component
@RequiredArgsConstructor
public class CustomerMapperHelper2 {
    private final CustomerRepository customerRepository;
    private final CustomerMapper2 customerMapper2;

    public CustomerEntity mapToEntity(Integer id) {
        return this.customerRepository.findOneByIdToCrud(id).orElse(null);
    }

    public CustomerInfoResponseDTO mapToInfoResponse(CustomerEntity customerEntity) {
        return this.customerMapper2.entityToInfoResponse(customerEntity);
    }
}