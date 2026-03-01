package vn.tuhoc.vinaeatery.domain;

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
	 * @see vn.tuhoc.vinaeatery.domain.UseTable#timeEnd
	 **/
	public static volatile SingularAttribute<UseTable, LocalDateTime> timeEnd;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.UseTable#timeStart
	 **/
	public static volatile SingularAttribute<UseTable, LocalDateTime> timeStart;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.UseTable#orderId
	 **/
	public static volatile SingularAttribute<UseTable, Integer> orderId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.UseTable#orderTableId
	 **/
	public static volatile SingularAttribute<UseTable, Integer> orderTableId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.UseTable#customerId
	 **/
	public static volatile SingularAttribute<UseTable, Integer> customerId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.UseTable#tableId
	 **/
	public static volatile SingularAttribute<UseTable, Integer> tableId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.UseTable#employeeId
	 **/
	public static volatile SingularAttribute<UseTable, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.UseTable#id
	 **/
	public static volatile SingularAttribute<UseTable, Long> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.UseTable
	 **/
	public static volatile EntityType<UseTable> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.UseTable#status
	 **/
	public static volatile SingularAttribute<UseTable, UseTableStatusEnum> status;

	public static final String TIME_END = "timeEnd";
	public static final String TIME_START = "timeStart";
	public static final String ORDER_ID = "orderId";
	public static final String ORDER_TABLE_ID = "orderTableId";
	public static final String CUSTOMER_ID = "customerId";
	public static final String TABLE_ID = "tableId";
	public static final String EMPLOYEE_ID = "employeeId";
	public static final String ID = "id";
	public static final String STATUS = "status";

}

