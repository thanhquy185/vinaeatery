package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.Mapper;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageInfoResponseDTO;

@Mapper(config = CentralMapperConfig.class, uses = {
                MessageDetailMapperHelper.class
})
public interface MessageMapper2 {
        MessageInfoResponseDTO entityToInfoResponse(MessageEntity messageEntity);
}
