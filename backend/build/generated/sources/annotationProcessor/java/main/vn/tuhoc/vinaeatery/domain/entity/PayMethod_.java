package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(PayMethod.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class PayMethod_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PayMethod#image
	 **/
	public static volatile SingularAttribute<PayMethod, String> image;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PayMethod#name
	 **/
	public static volatile SingularAttribute<PayMethod, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PayMethod#id
	 **/
	public static volatile SingularAttribute<PayMethod, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PayMethod
	 **/
	public static volatile EntityType<PayMethod> class_;

	public static final String IMAGE = "image";
	public static final String NAME = "name";
	public static final String ID = "id";

}

