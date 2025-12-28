package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import vn.tuhoc.vinaeatery.domain.criteria.MessageCriteria;
import vn.tuhoc.vinaeatery.domain.dto.MessageDetailDTO;
import vn.tuhoc.vinaeatery.domain.dto.MessageDTO;
import vn.tuhoc.vinaeatery.domain.entity.MessageDetail;
import vn.tuhoc.vinaeatery.domain.entity.Message;
import vn.tuhoc.vinaeatery.domain.entity.Message_;
import vn.tuhoc.vinaeatery.repository.MessageDetailRepository;
import vn.tuhoc.vinaeatery.repository.MessageRepository;
import vn.tuhoc.vinaeatery.service.specification.MessageSpecification;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final MessageDetailRepository messageDetailRepository;
    private final UseTableService useTableService;

    public MessageService(MessageRepository messageRepository,
            MessageDetailRepository messageDetailRepository,
            @Lazy UseTableService useTableService) {
        this.messageRepository = messageRepository;
        this.messageDetailRepository = messageDetailRepository;
        this.useTableService = useTableService;
    }

    // Methods
    public Message getOneById(Integer id) {
        return this.messageRepository.findOneById(id);
    }

    public Message getOneByUseTableId(Long useTableId) {
        return this.messageRepository.findOneByUseTableId(useTableId);
    }

    public MessageDTO getOneFormatById(Integer id) {
        MessageDTO messageDTO = new MessageDTO();
        Message message = this.messageRepository.findOneById(id);
        if (message != null) {
            List<MessageDetailDTO> messageDetails = new ArrayList<>();
            for (MessageDetail messageDetail : messageDetailRepository
                    .findAllByMessageId(message.getId())) {
                messageDetails.add(new MessageDetailDTO(messageDetail.getId().getSendAt(),
                        messageDetail.getId().getIsAdminSend(), messageDetail.getContent()));
            }

            messageDTO.setId(message.getId());
            messageDTO.setRestaurantId(message.getRestaurantId());
            messageDTO.setUseTable(useTableService.getOneFormatById(message.getUseTableId()));
            messageDTO.setIsRead(message.getIsRead());
            messageDTO.setMessageDetails(messageDetails);
        }

        return messageDTO;
    }

    public MessageDTO getOneFormatByUseTableId(Long useTableId) {
        MessageDTO messageDTO = new MessageDTO();
        Message message = this.messageRepository.findOneByUseTableId(useTableId);
        if (message != null) {
            List<MessageDetailDTO> messageDetails = new ArrayList<>();
            for (MessageDetail messageDetail : messageDetailRepository
                    .findAllByMessageId(message.getId())) {
                messageDetails.add(new MessageDetailDTO(messageDetail.getId().getSendAt(),
                        messageDetail.getId().getIsAdminSend(), messageDetail.getContent()));
            }

            messageDTO.setId(message.getId());
            messageDTO.setRestaurantId(message.getRestaurantId());
            messageDTO.setUseTable(null);
            messageDTO.setIsRead(message.getIsRead());
            messageDTO.setMessageDetails(messageDetails);
        }

        return messageDTO;
    }

    public List<Message> getAll() {
        return this.messageRepository.findAll();
    }

    public List<Message> getAll(MessageCriteria messageCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (messageCriteria.getSort() != null && messageCriteria.getSort().isPresent()) {
            String sortStr = messageCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(Message_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(Message_.ID).descending();
                case "Mã sử dụng bàn ăn tăng dần" -> sort = Sort.by(Message_.USE_TABLE_ID).ascending();
                case "Mã sử dụng bàn ăn giảm dần" -> sort = Sort.by(Message_.USE_TABLE_ID).descending();
            }
        }

        //
        if (messageCriteria.getId() == null
                && messageCriteria.getRestaurantId() == null
                && messageCriteria.getUseTableId() == null
                && messageCriteria.getUseTableTimeEnd() == null
                && messageCriteria.getSort() == null) {
            return this.messageRepository.findAll();
        }

        //
        Specification<Message> combinedSpec = Specification.where(null);
        if (messageCriteria.getId() != null && messageCriteria.getId().isPresent()) {
            if (messageCriteria.getId().get().matches("\\d+")) {
                Specification<Message> currentSpec = MessageSpecification
                        .idEqual(messageCriteria.getId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (messageCriteria.getRestaurantId() != null && messageCriteria.getRestaurantId().isPresent()) {
            if (messageCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<Message> currentSpec = MessageSpecification
                        .restaurantIdEqual(messageCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (messageCriteria.getUseTableId() != null && messageCriteria.getUseTableId().isPresent()) {
            if (messageCriteria.getUseTableId().get().matches("\\d+")) {
                Specification<Message> currentSpec = MessageSpecification
                        .useTableIdEqual(messageCriteria.getUseTableId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (messageCriteria.getUseTableTimeEnd() != null && messageCriteria.getUseTableTimeEnd().isPresent()) {
            if (messageCriteria.getUseTableTimeEnd().get().equals("null")) {
                Specification<Message> currentSpec = MessageSpecification.useTableTimeEndIsNull();
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }

        return this.messageRepository.findAll(combinedSpec, sort);
    }

    public List<MessageDTO> getAllFormat(MessageCriteria messageCriteria) {
        List<MessageDTO> listFormat = new ArrayList<>();
        for (Message message : getAll(messageCriteria)) {
            listFormat.add(getOneFormatById(message.getId()));
        }

        return listFormat;
    }

    public Message upsert(Message message) {
        return this.messageRepository.save(message);
    }
}
