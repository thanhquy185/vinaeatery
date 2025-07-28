package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.OrderSheetStatusEnum;

@StaticMetamodel(OrderSheet.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class OrderSheet_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderSheet#timeCreate
	 **/
	public static volatile SingularAttribute<OrderSheet, LocalDateTime> timeCreate;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderSheet#note
	 **/
	public static volatile SingularAttribute<OrderSheet, String> note;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderSheet#totalPrice
	 **/
	public static volatile SingularAttribute<OrderSheet, Long> totalPrice;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderSheet#tableId
	 **/
	public static volatile SingularAttribute<OrderSheet, Integer> tableId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderSheet#employeeId
	 **/
	public static volatile SingularAttribute<OrderSheet, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderSheet#id
	 **/
	public static volatile SingularAttribute<OrderSheet, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderSheet#message
	 **/
	public static volatile SingularAttribute<OrderSheet, String> message;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderSheet
	 **/
	public static volatile EntityType<OrderSheet> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderSheet#timeService
	 **/
	public static volatile SingularAttribute<OrderSheet, LocalDateTime> timeService;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderSheet#status
	 **/
	public static volatile SingularAttribute<OrderSheet, OrderSheetStatusEnum> status;

	public static final String TIME_CREATE = "timeCreate";
	public static final String NOTE = "note";
	public static final String TOTAL_PRICE = "totalPrice";
	public static final String TABLE_ID = "tableId";
	public static final String EMPLOYEE_ID = "employeeId";
	public static final String ID = "id";
	public static final String MESSAGE = "message";
	public static final String TIME_SERVICE = "timeService";
	public static final String STATUS = "status";

}

