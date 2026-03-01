package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(InputTicketDetail.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class InputTicketDetail_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.InputTicketDetail#quantity
	 **/
	public static volatile SingularAttribute<InputTicketDetail, Long> quantity;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.InputTicketDetail#price
	 **/
	public static volatile SingularAttribute<InputTicketDetail, Long> price;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.InputTicketDetail#id
	 **/
	public static volatile SingularAttribute<InputTicketDetail, InputTicketDetailId> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.InputTicketDetail
	 **/
	public static volatile EntityType<InputTicketDetail> class_;

	public static final String QUANTITY = "quantity";
	public static final String PRICE = "price";
	public static final String ID = "id";

}

