package de.fraunhofer.iosb.ilt.fisabackend.model;

import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObject;
import de.fraunhofer.iosb.ilt.sta.model.Id;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class UploadToFrostResponse {

    private final List<DatastreamConnectionData> datastreamConnectionData = new ArrayList<>();
    private final List<FisaObject> updatedObjects = new ArrayList<>();

    /**
     * Add one FisaObject to the updatedObjects list
     * @param fisaObject the Object to add to the list
     */
    public void addObject(FisaObject fisaObject) {
        if (fisaObject != null && !updatedObjects.contains(fisaObject)) {
            updatedObjects.add(fisaObject);
        }
    }

    /**
     * Adds a Datastream to the updatedObjects list and the datastreamConnectionData list
     * @param datastream
     * @param name the name of the Datastream
     */
    public void addDatastream(FisaObject datastream, String name) {
        if (datastream != null) {
            if (!updatedObjects.contains(datastream)) {
                updatedObjects.add(datastream);
            }
            DatastreamConnectionData datastreamData = new DatastreamConnectionData(name, datastream.getFrostId());
            if (!datastreamConnectionData.contains(datastreamData)) {
                datastreamConnectionData.add(datastreamData);
            }
        }
    }

    private static class DatastreamConnectionData {
        private String name;
        private Id id;
        DatastreamConnectionData(String name, Id id) {
            this.name = name;
            this.id = id;
        }

        @Override
        public boolean equals(Object o) {
            if (o.getClass() != DatastreamConnectionData.class) return false;
            DatastreamConnectionData toCompare = (DatastreamConnectionData) o;
            return toCompare.id == this.id && toCompare.name.equals(this.name);
        }

        @Override
        public int hashCode() {
            return Objects.hash(name, id);
        }

        public String getName() {
            return name;
        }

        public Id getId() {
            return id;
        }
    }

    /**
     * Returns the list of DatastreamConnectionData
     * @return the list of DatastreamConnectionData
     */
    public List<DatastreamConnectionData> getDatastreamConnectionData() {
        return datastreamConnectionData;
    }

    /**
     * returns the list of updated Objects
     * @return the list of updated Objects
     */
    public List<FisaObject> getUpdatedObjects() {
        return updatedObjects;
    }

}
