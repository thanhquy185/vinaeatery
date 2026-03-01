package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.UseTableStatusEnum;

@StaticMetamodel(UseTable.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class UseTable_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseTable#timeEnd
	 **/
	public static volatile SingularAttribute<UseTable, LocalDateTime> timeEnd;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseTable#orderId
	 **/
	public static volatile SingularAttribute<UseTable, Integer> orderId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseTable#orderTableId
	 **/
	public static volatile SingularAttribute<UseTable, Integer> orderTableId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseTable#employeeId
	 **/
	public static volatile SingularAttribute<UseTable, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseTable#restaurantId
	 **/
	public static volatile SingularAttribute<UseTable, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseTable#customerPhone
	 **/
	public static volatile SingularAttribute<UseTable, String> customerPhone;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseTable#timeStart
	 **/
	public static volatile SingularAttribute<UseTable, LocalDateTime> timeStart;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseTable#customerEmail
	 **/
	public static volatile SingularAttribute<UseTable, String> customerEmail;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseTable#customerId
	 **/
	public static volatile SingularAttribute<UseTable, Integer> customerId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseTable#tableId
	 **/
	public static volatile SingularAttribute<UseTable, Integer> tableId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseTable#id
	 **/
	public static volatile SingularAttribute<UseTable, Long> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseTable
	 **/
	public static volatile EntityType<UseTable> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseTable#customerFullname
	 **/
	public static volatile SingularAttribute<UseTable, String> customerFullname;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseTable#status
	 **/
	public static volatile SingularAttribute<UseTable, UseTableStatusEnum> status;

	public static final String TIME_END = "timeEnd";
	public static final String ORDER_ID = "orderId";
	public static final String ORDER_TABLE_ID = "orderTableId";
	public static final String EMPLOYEE_ID = "employeeId";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String CUSTOMER_PHONE = "customerPhone";
	public static final String TIME_START = "timeStart";
	public static final String CUSTOMER_EMAIL = "customerEmail";
	public static final String CUSTOMER_ID = "customerId";
	public static final String TABLE_ID = "tableId";
	public static final String ID = "id";
	public static final String CUSTOMER_FULLNAME = "customerFullname";
	public static final String STATUS = "status";

}

