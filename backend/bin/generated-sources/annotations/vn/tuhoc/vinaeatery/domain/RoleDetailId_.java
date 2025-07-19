package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(RoleDetailId.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class RoleDetailId_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.RoleDetailId#functionId
	 **/
	public static volatile SingularAttribute<RoleDetailId, Integer> functionId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.RoleDetailId#roleId
	 **/
	public static volatile SingularAttribute<RoleDetailId, Integer> roleId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.RoleDetailId#action
	 **/
	public static volatile SingularAttribute<RoleDetailId, String> action;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.RoleDetailId
	 **/
	public static volatile EmbeddableType<RoleDetailId> class_;

	public static final String FUNCTION_ID = "functionId";
	public static final String ROLE_ID = "roleId";
	public static final String ACTION = "action";

}

