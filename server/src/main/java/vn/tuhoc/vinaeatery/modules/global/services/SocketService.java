package vn.tuhoc.vinaeatery.modules.global.services;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SocketService {
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void handleConvertAndSend(String destination, Object payload) {
        this.simpMessagingTemplate.convertAndSend(destination, payload);
    }
}
