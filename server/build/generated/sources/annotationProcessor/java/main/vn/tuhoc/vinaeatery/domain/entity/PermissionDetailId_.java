package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(PermissionDetailId.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class PermissionDetailId_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PermissionDetailId#permissionId
	 **/
	public static volatile SingularAttribute<PermissionDetailId, Integer> permissionId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PermissionDetailId#functionId
	 **/
	public static volatile SingularAttribute<PermissionDetailId, Integer> functionId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PermissionDetailId#action
	 **/
	public static volatile SingularAttribute<PermissionDetailId, String> action;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.PermissionDetailId
	 **/
	public static volatile EmbeddableType<PermissionDetailId> class_;

	public static final String PERMISSION_ID = "permissionId";
	public static final String FUNCTION_ID = "functionId";
	public static final String ACTION = "action";

}

