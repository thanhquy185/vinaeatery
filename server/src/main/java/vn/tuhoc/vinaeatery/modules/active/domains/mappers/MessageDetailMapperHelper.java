package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageDDetailResponseDTO;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageDetailMapperHelper {
    final MessageDetailMapper messageDetailMapper;

    public MessageDDetailResponseDTO mapToDetailResponse(MessageDetailEntity messageDetailEntity) {
        return this.messageDetailMapper.entityToDetailResponse(messageDetailEntity);
    }
}