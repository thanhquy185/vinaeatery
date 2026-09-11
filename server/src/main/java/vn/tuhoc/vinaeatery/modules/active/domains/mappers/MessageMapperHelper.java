package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.MessageNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.repositories.MessageRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageMapperHelper {
    final MessageRepository messageRepository;
    final MessageMapper messageMapper;

    public MessageEntity mapToEntity(Integer id) {
        return this.messageRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new MessageNotFoundByIdException(id));
    }

    public MessageDetailResponseDTO mapToDetailResponse(MessageEntity messageEntity) {
        return this.messageMapper.entityToDetailResponse(messageEntity);
    }

    public MessageSummaryResponseDTO mapToSummaryResponse(MessageEntity messageEntity) {
        return this.messageMapper.entityToSummaryResponse(messageEntity);
    }

    public MessageInfoResponseDTO mapToInfoResponse(MessageEntity messageEntity) {
        return this.messageMapper.entityToInfoResponse(messageEntity);
    }
}