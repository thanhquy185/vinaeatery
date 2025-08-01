package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Floor;
import vn.tuhoc.vinaeatery.domain.criteria.FloorCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FloorUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormGetDataDTO;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.FloorService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormGetData;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/floors")
@AllArgsConstructor
public class FloorApiController {
    // Properties
    private final FloorService floorService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listFloor(@RequestBody @Valid FormGetDataDTO formGetDataDTO, FloorCriteria floorCriteria) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        List<Floor> listFloor = this.floorService
                .getAll(floorCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listFloor);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailFloor(@RequestBody @Valid FormGetDataDTO formGetDataDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        Floor floorSelected = this.floorService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(floorSelected);
    }

    @PostMapping("/create")
    public ResponseEntity<?> handleCreateFloor(@RequestBody @Valid Floor floor,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Floor floorCreate = this.floorService.upsert(floor);
        return ResponseEntity.status(HttpStatus.OK).body(floorCreate);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> handleUpdateFloor(@PathVariable("id") Integer id,
            @RequestBody @Valid FloorUpdateDTO floor,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Floor floorUpdated = this.floorService.getOneById(id);
        if (floorUpdated != null) {
            floorUpdated.setName(floor.getName());
            floorUpdated.setDescription(floor.getDescription());
            floorUpdated.setTimeUpdate(this.timeService.getDateTimeVN(floor.getTimeUpdate()));
            this.floorService.upsert(floorUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body(floorUpdated);
    }

    @PutMapping("/lock/{id}")
    public ResponseEntity<?> handleLockFloor(@PathVariable("id") Integer id,
            @RequestBody @Valid CommonStatusUpdateDTO commonStatusUpdate, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;
        LocalDateTime handleTimeUpdate = this.timeService.getDateTimeVN(commonStatusUpdate.getTimeUpdate());

        Floor floorLocked = this.floorService.getOneById(id);
        if (floorLocked != null) {
            floorLocked.setStatus(handleStatus);
            floorLocked.setTimeUpdate(handleTimeUpdate);
            this.floorService.lock(floorLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(floorLocked);
    }
}