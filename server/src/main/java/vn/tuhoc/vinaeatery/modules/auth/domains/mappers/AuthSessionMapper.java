package vn.tuhoc.vinaeatery.modules.auth.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.auth.domains.entities.AuthSessionEntity;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.AuthSessionCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.AuthSessionInfoResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                UserMapperHelper.class,
})
public interface AuthSessionMapper {
        AuthSessionInfoResponseDTO entityToInfoResponse(AuthSessionEntity authSessionEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "user", source = "userId")
        AuthSessionEntity createEntityFromRequest(
                        Integer userId,
                        AuthSessionCreateRequestDTO authSessionCreateRequestDTO);
}
