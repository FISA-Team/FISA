package de.fraunhofer.iosb.ilt.fisabackend.service.mapper.external.geojson;

import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.Mapper;
import de.fraunhofer.iosb.ilt.sta.model.EntityType;
import de.fraunhofer.iosb.ilt.sta.model.Location;
import org.geojson.Point;
import org.junit.jupiter.api.Test;


import static org.junit.jupiter.api.Assertions.assertEquals;

class GeoJsonObjectMapperTest {

    @Test
    void testResolveMapping() {
        String mapping = "point.longitude"; // everything before is already stripped
        GeoJsonObjectMapper<Location> mapper = new GeoJsonObjectMapper<>("location", loc -> {
            if (!(loc.getLocation() instanceof Point)) {
                return new Point();
            }
            return (Point) loc.getLocation();
        }, Location::setLocation, EntityType.LOCATION);
        Mapper resolve = mapper.resolve(mapping);
        assertEquals("CoordinateMapper", resolve.getClass().getSimpleName());
    }

}
