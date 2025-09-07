package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.HandlePaymentStatusEnum;

@StaticMetamodel(HandlePayment.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class HandlePayment_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.HandlePayment#payTotalPrice
	 **/
	public static volatile SingularAttribute<HandlePayment, Long> payTotalPrice;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.HandlePayment#employeeId
	 **/
	public static volatile SingularAttribute<HandlePayment, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.HandlePayment#id
	 **/
	public static volatile SingularAttribute<HandlePayment, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.HandlePayment#useTableId
	 **/
	public static volatile SingularAttribute<HandlePayment, Long> useTableId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.HandlePayment
	 **/
	public static volatile EntityType<HandlePayment> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.HandlePayment#payMethodId
	 **/
	public static volatile SingularAttribute<HandlePayment, Integer> payMethodId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.HandlePayment#status
	 **/
	public static volatile SingularAttribute<HandlePayment, HandlePaymentStatusEnum> status;

	public static final String PAY_TOTAL_PRICE = "payTotalPrice";
	public static final String EMPLOYEE_ID = "employeeId";
	public static final String ID = "id";
	public static final String USE_TABLE_ID = "useTableId";
	public static final String PAY_METHOD_ID = "payMethodId";
	public static final String STATUS = "status";

}

