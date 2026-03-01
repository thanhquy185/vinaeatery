package vn.tuhoc.vinaeatery.util;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import vn.tuhoc.vinaeatery.domain.dto.MomoRequestDTO;
import vn.tuhoc.vinaeatery.domain.dto.MomoResponseDTO;

@FeignClient(name = "momo-client", url = "${momo.dev.endpoint}")
public interface MomoClientUtil {
    @PostMapping("/create")
    MomoResponseDTO createMomoQR(@RequestBody MomoRequestDTO momoRequestDTO);

    @PostMapping("/refund")
    MomoResponseDTO cancelMomoPayment(@RequestBody MomoRequestDTO momoRequestDTO);
}
