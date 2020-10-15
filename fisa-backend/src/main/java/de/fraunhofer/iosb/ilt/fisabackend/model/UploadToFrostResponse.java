package de.fraunhofer.iosb.ilt.fisabackend.model;

import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObject;
import de.fraunhofer.iosb.ilt.sta.model.Id;

import java.util.ArrayList;
import java.util.List;

public class UploadToFrostResponse {

    private final List<DatastreamConnectionData> datastreamConnectionData = new ArrayList<>();
    private final List<FisaObject> updatedObjects = new ArrayList<>();

    public void addObject(FisaObject fisaObject) {
        if(fisaObject != null && !updatedObjects.contains(fisaObject)){
            updatedObjects.add(fisaObject);
        }
    }

    public void addDatastream(FisaObject datastream) {
        if(datastream != null ){
            if(!updatedObjects.contains(datastream)){
                updatedObjects.add(datastream);
            }
            DatastreamConnectionData datastreamData = new DatastreamConnectionData(datastream.getDefinitionName(), datastream.getFrostId());
            if(!datastreamConnectionData.contains(datastreamData)) {
                datastreamConnectionData.add(datastreamData);
            }
        }
    }

    private static class DatastreamConnectionData{
        private String name;
        private Id id;
        public DatastreamConnectionData(String name, Id id) {
            this.name = name;
            this.id = id;
        }

        @Override
        public boolean equals(Object o) {
            if(o.getClass() != DatastreamConnectionData.class) return false;
            DatastreamConnectionData toCompare = (DatastreamConnectionData) o;
            return toCompare.id == this.id && toCompare.name.equals(this.name);
        }

        public String getName() {
            return name;
        }

        public Id getId() {
            return id;
        }
    }

    public List<DatastreamConnectionData> getDatastreamConnectionData() {
        return datastreamConnectionData;
    }

    public List<FisaObject> getUpdatedObjects() {
        return updatedObjects;
    }

}
