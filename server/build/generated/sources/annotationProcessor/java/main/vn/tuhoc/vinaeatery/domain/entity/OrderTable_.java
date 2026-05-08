package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.OrderStatusEnum;

@StaticMetamodel(OrderTable.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class OrderTable_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderTable#employeeId
	 **/
	public static volatile SingularAttribute<OrderTable, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderTable#restaurantId
	 **/
	public static volatile SingularAttribute<OrderTable, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderTable#createAt
	 **/
	public static volatile SingularAttribute<OrderTable, String> createAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderTable#customerPhone
	 **/
	public static volatile SingularAttribute<OrderTable, String> customerPhone;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderTable#arriveAt
	 **/
	public static volatile SingularAttribute<OrderTable, String> arriveAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderTable#customerEmail
	 **/
	public static volatile SingularAttribute<OrderTable, String> customerEmail;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderTable#customerNote
	 **/
	public static volatile SingularAttribute<OrderTable, String> customerNote;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderTable#customerId
	 **/
	public static volatile SingularAttribute<OrderTable, Integer> customerId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderTable#guests
	 **/
	public static volatile SingularAttribute<OrderTable, Integer> guests;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderTable#id
	 **/
	public static volatile SingularAttribute<OrderTable, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderTable
	 **/
	public static volatile EntityType<OrderTable> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderTable#customerFullname
	 **/
	public static volatile SingularAttribute<OrderTable, String> customerFullname;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderTable#status
	 **/
	public static volatile SingularAttribute<OrderTable, OrderStatusEnum> status;

	public static final String EMPLOYEE_ID = "employeeId";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String CREATE_AT = "createAt";
	public static final String CUSTOMER_PHONE = "customerPhone";
	public static final String ARRIVE_AT = "arriveAt";
	public static final String CUSTOMER_EMAIL = "customerEmail";
	public static final String CUSTOMER_NOTE = "customerNote";
	public static final String CUSTOMER_ID = "customerId";
	public static final String GUESTS = "guests";
	public static final String ID = "id";
	public static final String CUSTOMER_FULLNAME = "customerFullname";
	public static final String STATUS = "status";

}

