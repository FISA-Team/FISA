package de.fraunhofer.iosb.ilt.fisabackend.util;

import de.fraunhofer.iosb.ilt.sta.ServiceFailureException;
import de.fraunhofer.iosb.ilt.sta.model.Datastream;
import de.fraunhofer.iosb.ilt.sta.model.Sensor;
import de.fraunhofer.iosb.ilt.sta.model.Thing;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class StaUtilTest {

    @Test
    void setInRelationSameType() {
        Thing thing = new Thing();
        Thing other = new Thing();
        assertFalse(StaUtil.setInRelation(thing, other));
    }

    @Test
    void testSetInRelationRelatedThingDatastream() throws ServiceFailureException {
        Thing thing = new Thing();
        Datastream datastream = new Datastream();
        assertTrue(StaUtil.setInRelation(thing, datastream));
        assertEquals(thing, datastream.getThing());
    }

    @Test
    void testSetInRelationUnrelatedSensorThing() {
        assertFalse(StaUtil.setInRelation(new Sensor(), new Thing()));
    }
}
