package de.fraunhofer.iosb.ilt.fisabackend.model;

import de.fraunhofer.iosb.ilt.sta.model.Id;
import de.fraunhofer.iosb.ilt.sta.model.IdLong;

public class EntityWrapper <E> {
    private final E entity;
    private Id id;

    public EntityWrapper(E entity){
        this.entity = entity;
    }

    public EntityWrapper(E entity, long id){
        this.entity = entity;
        this.id = new IdLong(id);
    }

    public EntityWrapper(E entity, Id id){
        this.entity = entity;
        this.id = id;
    }

    public  E getEntity() {
        return entity;
    }

    public Id getId() {
        return id;
    }

    public void setId(Id id) {
        this.id = id;
    }

    public boolean existsOnFrost() {
        return this.id == null;
    }
}
