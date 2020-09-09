package de.fraunhofer.iosb.ilt.fisabackend.service.mapper.external.geojson;

import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.Mapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.StaAttributeMapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.tree.FisaTreeNode;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.EntityType;
import org.geojson.LngLatAlt;
import org.geojson.Polygon;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.BiConsumer;

public class PolygonMapper<T extends Entity<T>> extends StaAttributeMapper<T> {

    private static final int MAX_POINT_DIMENSION = 2;

    private final BiConsumer<T, Polygon> setter;

    protected PolygonMapper(EntityType entityType, String attributeName,
                            BiConsumer<T, Polygon> setter) {
        super(entityType, attributeName);
        this.setter = setter;
    }

    @Override
    public void apply(FisaTreeNode treeNode, String... arguments) {
        Entity<?> entity = treeNode.getContext(Entity.class);
        if (!entityTypeMatches(entity)) {
            return;
        }
        @SuppressWarnings("unchecked")
        T checkedEntity = (T) entity;
        Polygon polygon = deserialize(arguments[0]);
        setter.accept(checkedEntity, polygon);
    }

    @Override
    public Mapper resolve(String mapsTo) {
        return null;
    }

    private static Polygon deserialize(String polygonString) {
        String stripped = polygonString.substring(1, polygonString.length() - 1);
        List<LngLatAlt> points = new ArrayList<>();
        for (String input : split(stripped)) {
            String strip = input.substring(1, input.length() - 1);
            List<String> split = split(strip);
            LngLatAlt lngLatAlt = listToPoint(split);
            points.add(lngLatAlt);
        }
        return new Polygon(points);
    }

    private static LngLatAlt listToPoint(List<String> rawPoint) {
        if (rawPoint.size() < 2) {
            throw new IllegalArgumentException("Point must have longitude and latitude: " + rawPoint);
        }
        double lng = Double.parseDouble(rawPoint.get(0));
        double lat = Double.parseDouble(rawPoint.get(1));
        double alt = 0;
        if (rawPoint.size() > MAX_POINT_DIMENSION) { // we're just ignoring higher dimensions
            alt = Double.parseDouble(rawPoint.get(2));
        }
        return new LngLatAlt(lng, lat, alt);
    }

    private static List<String> split(String input) {
        if (input.indexOf('[') == -1 && input.indexOf(']') == -1) {
            return Arrays.asList(input.split(String.valueOf(',')));
        }
        int level = 0;
        int begin = 0;
        List<String> split = new ArrayList<>();
        for (int i = 0; i < input.length(); i++) {
            char c = input.charAt(i);
            if (c == ',' && level == 0) {
                split.add(input.substring(begin, i));
                begin = i + 1;
            } else if (c == '[') {
                level++;
            } else if (c == ']') {
                level--;
            }
        }
        if (begin < input.length()) {
            split.add(input.substring(begin));
        }
        return split;
    }
}
