package vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers;

import org.mapstruct.Mapper;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.CustomerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerInfoResponseDTO;

@Mapper(config = CentralMapperConfig.class)
public interface CustomerMapper2 {
        CustomerInfoResponseDTO entityToInfoResponse(CustomerEntity customerEntity);
}
