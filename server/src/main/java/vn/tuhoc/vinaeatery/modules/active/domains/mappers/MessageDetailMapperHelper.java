package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageDDetailResponseDTO;

@Component
@RequiredArgsConstructor
public class MessageDetailMapperHelper {
    private final MessageDetailMapper messageDetailMapper;

    public MessageDDetailResponseDTO mapToDetailResponse(MessageDetailEntity messageDetailEntity) {
        return this.messageDetailMapper.entityToDetailResponse(messageDetailEntity);
    }
}