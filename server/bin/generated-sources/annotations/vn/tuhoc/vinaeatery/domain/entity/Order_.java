package vn.tuhoc.vinaeatery.domain.entity;

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
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#payTotalPrice
	 **/
	public static volatile SingularAttribute<Order, Long> payTotalPrice;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#totalPrice
	 **/
	public static volatile SingularAttribute<Order, Long> totalPrice;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#payTime
	 **/
	public static volatile SingularAttribute<Order, LocalDateTime> payTime;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#employeeId
	 **/
	public static volatile SingularAttribute<Order, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#restaurantId
	 **/
	public static volatile SingularAttribute<Order, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#createAt
	 **/
	public static volatile SingularAttribute<Order, LocalDateTime> createAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#payMethodId
	 **/
	public static volatile SingularAttribute<Order, Integer> payMethodId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#customerPhone
	 **/
	public static volatile SingularAttribute<Order, String> customerPhone;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#customerEmail
	 **/
	public static volatile SingularAttribute<Order, String> customerEmail;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#customerId
	 **/
	public static volatile SingularAttribute<Order, Integer> customerId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#id
	 **/
	public static volatile SingularAttribute<Order, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#payId
	 **/
	public static volatile SingularAttribute<Order, String> payId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order
	 **/
	public static volatile EntityType<Order> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#payStatus
	 **/
	public static volatile SingularAttribute<Order, PayStatusEnum> payStatus;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#customerFullname
	 **/
	public static volatile SingularAttribute<Order, String> customerFullname;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Order#status
	 **/
	public static volatile SingularAttribute<Order, OrderStatusEnum> status;

	public static final String PAY_TOTAL_PRICE = "payTotalPrice";
	public static final String TOTAL_PRICE = "totalPrice";
	public static final String PAY_TIME = "payTime";
	public static final String EMPLOYEE_ID = "employeeId";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String CREATE_AT = "createAt";
	public static final String PAY_METHOD_ID = "payMethodId";
	public static final String CUSTOMER_PHONE = "customerPhone";
	public static final String CUSTOMER_EMAIL = "customerEmail";
	public static final String CUSTOMER_ID = "customerId";
	public static final String ID = "id";
	public static final String PAY_ID = "payId";
	public static final String PAY_STATUS = "payStatus";
	public static final String CUSTOMER_FULLNAME = "customerFullname";
	public static final String STATUS = "status";

}

