package vn.tuhoc.vinaeatery.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.RewardPunishCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.RewardPunishDTO;
import vn.tuhoc.vinaeatery.domain.entity.RewardPunish;
import vn.tuhoc.vinaeatery.domain.request.RewardPunishCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.RewardPunishUpdateRequest;
// import vn.tuhoc.vinaeatery.service.EmployeeService;
import vn.tuhoc.vinaeatery.service.RewardPunishService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/reward-punishes")
@RequiredArgsConstructor
public class RewardPunishApiController {
        // Properties
        private final RewardPunishService rewardPunishService;
        // private final EmployeeService employeeService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listRewardPunish(@RequestBody FormSecurityDTO formSecurityDTO,
                        RewardPunishCriteria rewardPunishCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "reward-punishes", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<RewardPunish> listRewardPunish = this.rewardPunishService.getAll(rewardPunishCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listRewardPunish);
        }

        @PostMapping("/list-format")
        public ResponseEntity<?> listRewardPunishFormat(@RequestBody FormSecurityDTO formSecurityDTO,
                        RewardPunishCriteria rewardPunishCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "reward-punishes", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<RewardPunishDTO> listRewardPunish = this.rewardPunishService
                                .getAllFormat(rewardPunishCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listRewardPunish);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailRewardPunish(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "reward-punishes", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                RewardPunish rewardPunishSelected = this.rewardPunishService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(rewardPunishSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleCreateRewardPunish(
                        @RequestBody @Valid RewardPunishCreateRequest rewardPunishCreateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(rewardPunishCreateRequest.getFormSecurity(),
                                "reward-punishes",
                                "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }
                if (rewardPunishCreateRequest.getRewardPunish() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu phiếu nhập không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                RewardPunish rewardPunishCreated = this.rewardPunishService
                                .upsert(rewardPunishCreateRequest.getRewardPunish());

                return ResponseEntity.status(HttpStatus.OK).body(rewardPunishCreated);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleUpdateRewardPunish(@PathVariable("id") Integer id,
                        @RequestBody @Valid RewardPunishUpdateRequest rewardPunishUpdateRequest) {
                if (!HandleFormSecurity.isValidFormData(rewardPunishUpdateRequest.getFormSecurity(),
                                "reward-punishes",
                                "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                RewardPunish rewardPunishUpdated = this.rewardPunishService.getOneById(id);
                // if (rewardPunishUpdateRequest.getRewardPunish().getEmployeeHandleId() !=
                // null) {
                // rewardPunishUpdated
                // .setEmployeeHandleId(rewardPunishUpdateRequest.getRewardPunish()
                // .getEmployeeHandleId());
                // }
                if (rewardPunishUpdateRequest.getRewardPunish().getStatus() != null) {
                        rewardPunishUpdated.setStatus(rewardPunishUpdateRequest.getRewardPunish().getStatus());
                }
                this.rewardPunishService.upsert(rewardPunishUpdated);

                return ResponseEntity.status(HttpStatus.OK).body(rewardPunishUpdated);
        }
}
