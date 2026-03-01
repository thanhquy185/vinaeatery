package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.PermissionTicketStatusEnum;

@StaticMetamodel(PermissionTicket.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class PermissionTicket_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PermissionTicket#date
	 **/
	public static volatile SingularAttribute<PermissionTicket, String> date;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PermissionTicket#reason
	 **/
	public static volatile SingularAttribute<PermissionTicket, String> reason;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PermissionTicket#categoryPermissionTicketId
	 **/
	public static volatile SingularAttribute<PermissionTicket, Integer> categoryPermissionTicketId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PermissionTicket#employeeMainId
	 **/
	public static volatile SingularAttribute<PermissionTicket, Integer> employeeMainId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PermissionTicket#id
	 **/
	public static volatile SingularAttribute<PermissionTicket, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PermissionTicket#employeeHandleId
	 **/
	public static volatile SingularAttribute<PermissionTicket, Integer> employeeHandleId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PermissionTicket#restaurantId
	 **/
	public static volatile SingularAttribute<PermissionTicket, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PermissionTicket
	 **/
	public static volatile EntityType<PermissionTicket> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PermissionTicket#createAt
	 **/
	public static volatile SingularAttribute<PermissionTicket, String> createAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PermissionTicket#status
	 **/
	public static volatile SingularAttribute<PermissionTicket, PermissionTicketStatusEnum> status;

	public static final String DATE = "date";
	public static final String REASON = "reason";
	public static final String CATEGORY_PERMISSION_TICKET_ID = "categoryPermissionTicketId";
	public static final String EMPLOYEE_MAIN_ID = "employeeMainId";
	public static final String ID = "id";
	public static final String EMPLOYEE_HANDLE_ID = "employeeHandleId";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String CREATE_AT = "createAt";
	public static final String STATUS = "status";

}

