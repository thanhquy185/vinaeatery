package vn.tuhoc.vinaeatery.modules.global.services;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SocketService {
    final SimpMessagingTemplate simpMessagingTemplate;

    public void handleConvertAndSend(String destination, Object payload) {
        this.simpMessagingTemplate.convertAndSend(destination, payload);
    }
}
