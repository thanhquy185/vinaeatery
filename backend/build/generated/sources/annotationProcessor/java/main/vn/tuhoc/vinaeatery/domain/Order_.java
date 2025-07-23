package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.OrderStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;

@StaticMetamodel(Order.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Order_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Order#timeCreate
	 **/
	public static volatile SingularAttribute<Order, LocalDateTime> timeCreate;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Order#totalPrice
	 **/
	public static volatile SingularAttribute<Order, Long> totalPrice;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Order#customerId
	 **/
	public static volatile SingularAttribute<Order, Integer> customerId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Order#tableId
	 **/
	public static volatile SingularAttribute<Order, Integer> tableId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Order#employeeId
	 **/
	public static volatile SingularAttribute<Order, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Order#id
	 **/
	public static volatile SingularAttribute<Order, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Order
	 **/
	public static volatile EntityType<Order> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Order#payStatus
	 **/
	public static volatile SingularAttribute<Order, PayStatusEnum> payStatus;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Order#status
	 **/
	public static volatile SingularAttribute<Order, OrderStatusEnum> status;

	public static final String TIME_CREATE = "timeCreate";
	public static final String TOTAL_PRICE = "totalPrice";
	public static final String CUSTOMER_ID = "customerId";
	public static final String TABLE_ID = "tableId";
	public static final String EMPLOYEE_ID = "employeeId";
	public static final String ID = "id";
	public static final String PAY_STATUS = "payStatus";
	public static final String STATUS = "status";

}

