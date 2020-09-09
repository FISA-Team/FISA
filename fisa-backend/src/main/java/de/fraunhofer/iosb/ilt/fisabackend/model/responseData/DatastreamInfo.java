package de.fraunhofer.iosb.ilt.fisabackend.model.responseData;

import de.fraunhofer.iosb.ilt.sta.model.Datastream;
import de.fraunhofer.iosb.ilt.sta.model.Id;

/**
 * A class used to store the name and id of a datastream.
 * @author Nicolai Hüning
 */
public class DatastreamInfo {
    private String name;
    private Id id;

    /**
     * Constructor
     * @param datastream - the Datastream to get the name and id from
     */
    public DatastreamInfo(Datastream datastream) {
        this.name = datastream.getName();
        this.id = datastream.getId();
    }

    /**
     * @return - the Datastream name
     */
    public String getName() {
        return name;
    }

    /**
     * @return - the id of the Datastream
     */
    public Id getId() {
        return id;
    }
}
