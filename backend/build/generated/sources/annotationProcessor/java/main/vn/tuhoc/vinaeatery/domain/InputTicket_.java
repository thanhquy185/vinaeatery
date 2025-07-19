package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.InputTicketStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;

@StaticMetamodel(InputTicket.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class InputTicket_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.InputTicket#timeCreate
	 **/
	public static volatile SingularAttribute<InputTicket, LocalDateTime> timeCreate;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.InputTicket#supplierId
	 **/
	public static volatile SingularAttribute<InputTicket, Integer> supplierId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.InputTicket#totalPrice
	 **/
	public static volatile SingularAttribute<InputTicket, Long> totalPrice;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.InputTicket#employeeId
	 **/
	public static volatile SingularAttribute<InputTicket, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.InputTicket#id
	 **/
	public static volatile SingularAttribute<InputTicket, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.InputTicket
	 **/
	public static volatile EntityType<InputTicket> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.InputTicket#payStatus
	 **/
	public static volatile SingularAttribute<InputTicket, PayStatusEnum> payStatus;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.InputTicket#status
	 **/
	public static volatile SingularAttribute<InputTicket, InputTicketStatusEnum> status;

	public static final String TIME_CREATE = "timeCreate";
	public static final String SUPPLIER_ID = "supplierId";
	public static final String TOTAL_PRICE = "totalPrice";
	public static final String EMPLOYEE_ID = "employeeId";
	public static final String ID = "id";
	public static final String PAY_STATUS = "payStatus";
	public static final String STATUS = "status";

}

