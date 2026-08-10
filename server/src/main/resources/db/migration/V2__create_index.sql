-- Bill Index
CREATE INDEX `IDX_bill__restaurant__status__paymentStatus__createAt`
ON `bills` (`restaurant_id`, `status`, `payment_status`, `create_at`);

-- Input Ticket Index
CREATE INDEX `IDX_inputTicket__restaurant__status__paymentStatus__createAt`
ON `input_tickets` (`restaurant_id`, `status`, `payment_status`, `create_at`);