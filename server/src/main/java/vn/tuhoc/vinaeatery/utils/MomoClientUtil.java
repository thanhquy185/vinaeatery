package vn.tuhoc.vinaeatery.utils;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import vn.tuhoc.vinaeatery.modules.payment.dtos.requests.MomoRequestDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.MomoResponseDTO;

@FeignClient(name = "momo-client", url = "${momo.endpoint}")
public interface MomoClientUtil {
    @PostMapping("/create")
    MomoResponseDTO createMomoOrder(@RequestBody MomoRequestDTO momoRequestDTO);

    @PostMapping("/refund")
    MomoResponseDTO cancelMomoOrder(@RequestBody MomoRequestDTO momoRequestDTO);
}
