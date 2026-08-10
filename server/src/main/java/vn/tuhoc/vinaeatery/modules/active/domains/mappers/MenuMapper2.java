package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuInfoResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                MenuDetailMapperHelper.class
})
public interface MenuMapper2 {
        MenuInfoResponseDTO entityToInfoResponse(MenuEntity menuEntity);

        MenuCustomerResponseDTO entityToCustomerResponse(MenuEntity menuEntity);
}
