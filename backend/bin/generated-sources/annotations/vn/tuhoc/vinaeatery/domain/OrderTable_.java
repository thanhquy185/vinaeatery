package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;

@StaticMetamodel(OrderTable.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class OrderTable_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderTable#timeArrive
	 **/
	public static volatile SingularAttribute<OrderTable, LocalDateTime> timeArrive;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderTable#note
	 **/
	public static volatile SingularAttribute<OrderTable, String> note;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderTable#address
	 **/
	public static volatile SingularAttribute<OrderTable, String> address;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderTable#phone
	 **/
	public static volatile SingularAttribute<OrderTable, String> phone;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderTable#timeUpdate
	 **/
	public static volatile SingularAttribute<OrderTable, LocalDateTime> timeUpdate;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderTable#employeeId
	 **/
	public static volatile SingularAttribute<OrderTable, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderTable#id
	 **/
	public static volatile SingularAttribute<OrderTable, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderTable#fullname
	 **/
	public static volatile SingularAttribute<OrderTable, String> fullname;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderTable
	 **/
	public static volatile EntityType<OrderTable> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderTable#timeOrder
	 **/
	public static volatile SingularAttribute<OrderTable, LocalDateTime> timeOrder;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderTable#email
	 **/
	public static volatile SingularAttribute<OrderTable, String> email;

	public static final String TIME_ARRIVE = "timeArrive";
	public static final String NOTE = "note";
	public static final String ADDRESS = "address";
	public static final String PHONE = "phone";
	public static final String TIME_UPDATE = "timeUpdate";
	public static final String EMPLOYEE_ID = "employeeId";
	public static final String ID = "id";
	public static final String FULLNAME = "fullname";
	public static final String TIME_ORDER = "timeOrder";
	public static final String EMAIL = "email";

}

