package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(RoleHistoryId.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class RoleHistoryId_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RoleHistoryId#dateStart
	 **/
	public static volatile SingularAttribute<RoleHistoryId, String> dateStart;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RoleHistoryId#roleId
	 **/
	public static volatile SingularAttribute<RoleHistoryId, Integer> roleId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RoleHistoryId#employeeId
	 **/
	public static volatile SingularAttribute<RoleHistoryId, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RoleHistoryId
	 **/
	public static volatile EmbeddableType<RoleHistoryId> class_;

	public static final String DATE_START = "dateStart";
	public static final String ROLE_ID = "roleId";
	public static final String EMPLOYEE_ID = "employeeId";

}

