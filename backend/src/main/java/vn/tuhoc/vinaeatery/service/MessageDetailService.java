package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.entity.MessageDetail;
import vn.tuhoc.vinaeatery.domain.entity.MessageDetailId;
import vn.tuhoc.vinaeatery.repository.MessageDetailRepository;

@Service
@RequiredArgsConstructor
public class MessageDetailService {
    // Properties
    private final MessageDetailRepository messageDetailRepository;

    // Methods
    public MessageDetail getOneById(MessageDetailId id) {
        return this.messageDetailRepository.findOneById(id);
    }

    public List<MessageDetail> getAll() {
        return this.messageDetailRepository.findAll();
    }

    public List<MessageDetail> getAllByMessageId(Integer messageId) {
        return this.messageDetailRepository.findAllByMessageId(messageId);
    }

    public MessageDetail upsert(MessageDetail messageDetail) {
        return this.messageDetailRepository.save(messageDetail);
    }
}