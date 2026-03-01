package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Function.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Function_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Function#id
	 **/
	public static volatile SingularAttribute<Function, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Function#nameEN
	 **/
	public static volatile SingularAttribute<Function, String> nameEN;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Function#nameVN
	 **/
	public static volatile SingularAttribute<Function, String> nameVN;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Function#category
	 **/
	public static volatile SingularAttribute<Function, String> category;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Function
	 **/
	public static volatile EntityType<Function> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Function#actions
	 **/
	public static volatile SingularAttribute<Function, String> actions;

	public static final String ID = "id";
	public static final String NAME_EN = "nameEN";
	public static final String NAME_VN = "nameVN";
	public static final String CATEGORY = "category";
	public static final String ACTIONS = "actions";

}

