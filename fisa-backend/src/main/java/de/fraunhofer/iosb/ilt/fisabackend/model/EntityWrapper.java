package de.fraunhofer.iosb.ilt.fisabackend.model;

import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObject;
import de.fraunhofer.iosb.ilt.sta.model.Entity;

import java.util.Objects;

public class EntityWrapper<E extends Entity<?>> {
    private final E entity;
    private FisaObject definingFisaObject;

    /**
     * The constructor for an Entity without a defining FisaObject
     * @param entity the Entity wrapped by this Wrapper-Class
     */
    public EntityWrapper(E entity) {
        this.entity = entity;
    }

    /**
     * The constructor for the EntityWrapper
     * @param entity the Entity this Wrapper should wrap
     * @param definingFisaObject the defining FisaObject of this wrapper
     */
    public EntityWrapper(E entity, FisaObject definingFisaObject) {
        this.entity = entity;
        this.definingFisaObject = definingFisaObject;
        if (definingFisaObject != null && definingFisaObject.getFrostId() != null) {
            entity.setId(definingFisaObject.getFrostId());
        }
    }

    /**
     * returns the Entity stored in this wrapper
     * @return the Entity stored in this wrapper
     */
    public  E getEntity() {
        return entity;
    }

    /**
     * returns the defining FisaObject stored in this EntityWrapper
     * @return the defining FisaObject stored in this EntityWrapper
     */
    public FisaObject getDefiningFisaObject() {
        return definingFisaObject;
    }

    /**
     * Applys the FROST-Id to the defining FISA-Opbject
     */
    public void setFrostId() {
        if (this.definingFisaObject != null && this.entity != null) {
            this.definingFisaObject.setFrostId(entity.getId().getJson());
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EntityWrapper<?> that = (EntityWrapper<?>) o;
        return Objects.equals(entity, that.entity)
                && Objects.equals(definingFisaObject, that.definingFisaObject);
    }

    @Override
    public int hashCode() {
        return Objects.hash(entity, definingFisaObject);
    }

    public String toString() {
        return entity.toString();
    }
}
