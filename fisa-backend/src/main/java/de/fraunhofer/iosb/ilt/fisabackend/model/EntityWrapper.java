package de.fraunhofer.iosb.ilt.fisabackend.model;

import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObject;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.Id;
import de.fraunhofer.iosb.ilt.sta.model.IdLong;

public class EntityWrapper <E extends Entity<?>> {
    private final E entity;
    private FisaObject definingFisaObject;

    public EntityWrapper(E entity){
        this.entity = entity;
    }

    public EntityWrapper(E entity, FisaObject definingFisaObject){
        this.entity = entity;
        this.definingFisaObject = definingFisaObject;
        if(definingFisaObject != null && definingFisaObject.getFrostId() != null) {
            entity.setId(definingFisaObject.getFrostId());
        }
    }

    public  E getEntity() {
        return entity;
    }

    public FisaObject getDefiningFisaObject() {
        return definingFisaObject;
    }

    public void setFrostId() {
        if(this.definingFisaObject != null && this.entity != null) {
            this.definingFisaObject.setFrostId(entity.getId().getJson());
        }
    }

}
