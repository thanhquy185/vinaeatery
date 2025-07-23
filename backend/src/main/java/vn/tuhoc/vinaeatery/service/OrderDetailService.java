package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.OrderDetail;
import vn.tuhoc.vinaeatery.domain.OrderDetailId;
import vn.tuhoc.vinaeatery.repository.OrderDetailRepository;

@Service
@AllArgsConstructor
public class OrderDetailService {
    // Properties
    private final OrderDetailRepository orderDetailRepository;

    // Methods
    public OrderDetail getOneById(OrderDetailId id) {
        return this.orderDetailRepository.findOneById(id);
    }

    public List<OrderDetail> getAll() {
        return this.orderDetailRepository.findAll();
    }

    public List<OrderDetail> getAllByOrderId(Integer orderId) {
        return this.orderDetailRepository.findAllByOrderId(orderId);
    }

    public OrderDetail upsert(OrderDetail orderDetail) {
        return this.orderDetailRepository.save(orderDetail);
    }
}