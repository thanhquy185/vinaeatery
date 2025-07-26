package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.OrderSheetDetail;
import vn.tuhoc.vinaeatery.domain.OrderSheetDetailId;
import vn.tuhoc.vinaeatery.repository.OrderSheetDetailRepository;

@Service
@AllArgsConstructor
public class OrderSheetDetailService {
    // Properties
    private final OrderSheetDetailRepository orderSheetDetailRepository;

    // Methods
    public OrderSheetDetail getOneById(OrderSheetDetailId id) {
        return this.orderSheetDetailRepository.findOneById(id);
    }

    public List<OrderSheetDetail> getAll() {
        return this.orderSheetDetailRepository.findAll();
    }

    public List<OrderSheetDetail> getAllByOrderSheetId(Integer orderSheetId) {
        return this.orderSheetDetailRepository.findAllByOrderSheetId(orderSheetId);
    }

    public OrderSheetDetail upsert(OrderSheetDetail orderSheetDetail) {
        return this.orderSheetDetailRepository.save(orderSheetDetail);
    }
}