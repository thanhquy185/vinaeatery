package vn.tuhoc.vinaeatery.modules.active.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.MessageDetailMapper;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.MessageMapper;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MessageCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.MessageNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.exceptions.UseTableNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.repositories.MessageRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.UseTableRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.MessageCriteria;
import vn.tuhoc.vinaeatery.modules.active.repositories.specifications.MessageSpecification;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.MessageService;
import vn.tuhoc.vinaeatery.modules.global.dtos.requests.CustomerSendMessageRequestDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.requests.RestaurantReadMessageRequestDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.requests.RestaurantSendMessageRequestDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.services.TimeService;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageServiceImplement implements MessageService {
    final TimeService timeService;
    final UseTableRepository useTableRepository;
    final MessageRepository messageRepository;
    final MessageMapper messageMapper;
    final MessageDetailMapper messageDetailMapper;

    private MessageEntity getOneById(Integer id) {
        return this.messageRepository.findOneById(id)
                .orElseThrow(() -> new MessageNotFoundByIdException(id));
    }

    private Page<MessageEntity> getAll(MessageCriteria messageCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(messageCriteria.getSort())) {
            String sortString = messageCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(messageCriteria.getPage())
                && ValidationUtil.nonNull(messageCriteria.getSize())) {
            pageable = PageRequest.of(
                    messageCriteria.getPage(),
                    messageCriteria.getSize(),
                    sort);
        }

        Specification<MessageEntity> specification = MessageSpecification.filterMessages(messageCriteria);

        return this.messageRepository.findAll(specification, pageable);
    }

    @Override
    public MessageDetailResponseDTO handleGetDetailById(Integer id) {
        return this.messageMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Override
    public PageResponseDTO<MessageSummaryResponseDTO> handleGetSummary(MessageCriteria messageCriteria) {
        Page<MessageSummaryResponseDTO> page = this.getAll(messageCriteria)
                .map(this.messageMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Override
    public MessageDetailResponseDTO handleCreate(MessageCreateRequestDTO messageCreateRequestDTO) {
        MessageEntity messageEntity = this.messageMapper.createEntityFromRequest(messageCreateRequestDTO);

        messageCreateRequestDTO.getMessageDetails().forEach((messageDetailCreateRequestDTO) -> {
            MessageDetailEntity messageDetailEntity = this.messageDetailMapper
                    .createEntityFromRequest(messageDetailCreateRequestDTO);

            messageEntity.addMessageDetail(messageDetailEntity);
        });

        return this.messageMapper.entityToDetailResponse(this.messageRepository.save(messageEntity));
    }

    @Override
    public MessageEntity handleRestaurantReadMessage(RestaurantReadMessageRequestDTO restaurantReadMessageRequestDTO) {
        MessageEntity messageEntity = this.getOneById(restaurantReadMessageRequestDTO.getMessageId());
        messageEntity.setIsRead(true);

        return messageEntity;
    }

    @Override
    public MessageEntity handleRestaurantSendMessage(RestaurantSendMessageRequestDTO restaurantSendMessageRequestDTO) {
        MessageEntity messageEntity = this.getOneById(restaurantSendMessageRequestDTO.getMessageId());
        if (ValidationUtil.nonNull(restaurantSendMessageRequestDTO.getMessageDetail())) {
            MessageDetailEntity messageDetailEntity = this.messageDetailMapper
                    .createEntityFromRequest(restaurantSendMessageRequestDTO.getMessageDetail());
            messageEntity.addMessageDetail(messageDetailEntity);
        }

        return messageEntity;
    }

    @Override
    public MessageEntity handleCustomerSendMessage(CustomerSendMessageRequestDTO customerSendMessageRequestDTO) {
        UseTableEntity useTableEntity = this.useTableRepository
                .findOneById(customerSendMessageRequestDTO.getUseTableId())
                .orElseThrow(() -> new UseTableNotFoundByIdException(customerSendMessageRequestDTO.getUseTableId()));
        MessageEntity messageEntity = this.messageRepository
                .findOneByUseTableId(customerSendMessageRequestDTO.getUseTableId()).orElse(null);

        if (messageEntity != null) {
            messageEntity.setIsRead(false);

            if (ValidationUtil.nonNull(customerSendMessageRequestDTO.getMessageDetail())) {
                MessageDetailEntity messageDetailEntity = this.messageDetailMapper
                        .createEntityFromRequest(customerSendMessageRequestDTO.getMessageDetail());
                messageEntity.addMessageDetail(messageDetailEntity);
            }
        } else {
            MessageCreateRequestDTO messageCreateRequestDTO = MessageCreateRequestDTO.builder()
                    .restaurantId(customerSendMessageRequestDTO.getRestaurantId())
                    .useTableId(customerSendMessageRequestDTO.getUseTableId())
                    .createAt(this.timeService.getCurrentDatetime())
                    .isRead(false)
                    .build();
            MessageEntity messageEntityCreated = this.messageRepository
                    .save(this.messageMapper.createEntityFromRequest(messageCreateRequestDTO));

            if (ValidationUtil.nonNull(customerSendMessageRequestDTO.getMessageDetail())) {
                MessageDetailEntity messageDetailEntity = this.messageDetailMapper
                        .createEntityFromRequest(customerSendMessageRequestDTO.getMessageDetail());
                messageEntityCreated.addMessageDetail(messageDetailEntity);
            }

            useTableEntity.setMessage(messageEntityCreated);

            return messageEntityCreated;
        }

        return messageEntity;
    }
}
