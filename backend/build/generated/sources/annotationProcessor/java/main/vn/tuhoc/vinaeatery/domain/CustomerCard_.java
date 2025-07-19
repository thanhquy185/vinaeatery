package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(CustomerCard.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class CustomerCard_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.CustomerCard#image
	 **/
	public static volatile SingularAttribute<CustomerCard, String> image;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.CustomerCard#timeUpdate
	 **/
	public static volatile SingularAttribute<CustomerCard, LocalDateTime> timeUpdate;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.CustomerCard#name
	 **/
	public static volatile SingularAttribute<CustomerCard, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.CustomerCard#discount
	 **/
	public static volatile SingularAttribute<CustomerCard, Integer> discount;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.CustomerCard#description
	 **/
	public static volatile SingularAttribute<CustomerCard, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.CustomerCard#threshold
	 **/
	public static volatile SingularAttribute<CustomerCard, Long> threshold;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.CustomerCard#id
	 **/
	public static volatile SingularAttribute<CustomerCard, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.CustomerCard
	 **/
	public static volatile EntityType<CustomerCard> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.CustomerCard#status
	 **/
	public static volatile SingularAttribute<CustomerCard, CommonStatusEnum> status;

	public static final String IMAGE = "image";
	public static final String TIME_UPDATE = "timeUpdate";
	public static final String NAME = "name";
	public static final String DISCOUNT = "discount";
	public static final String DESCRIPTION = "description";
	public static final String THRESHOLD = "threshold";
	public static final String ID = "id";
	public static final String STATUS = "status";

}

