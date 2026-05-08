package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Allowance.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Allowance_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Allowance#note
	 **/
	public static volatile SingularAttribute<Allowance, String> note;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Allowance#month
	 **/
	public static volatile SingularAttribute<Allowance, String> month;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Allowance#name
	 **/
	public static volatile SingularAttribute<Allowance, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Allowance#id
	 **/
	public static volatile SingularAttribute<Allowance, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Allowance#restaurantId
	 **/
	public static volatile SingularAttribute<Allowance, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Allowance
	 **/
	public static volatile EntityType<Allowance> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Allowance#status
	 **/
	public static volatile SingularAttribute<Allowance, CommonStatusEnum> status;

	public static final String NOTE = "note";
	public static final String MONTH = "month";
	public static final String NAME = "name";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String STATUS = "status";

}

