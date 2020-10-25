package de.fraunhofer.iosb.ilt.fisabackend.service.mapper;

import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.StaEntityMapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.StaMapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.StaSimpleAttributeMapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.complex.StaMapMapper;
import de.fraunhofer.iosb.ilt.sta.model.EntityType;
import de.fraunhofer.iosb.ilt.sta.model.Thing;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

class StaMappingResolverTest {

    private DynamicMappingResolver resolver;

    @BeforeEach
    void setUp() {
        this.resolver = new DynamicMappingResolver();
        this.resolver.registerRootMapper("STA", new StaMapper());
    }

    @Test
    void testThing() {
        Mapper resolve = resolver.resolve("STA.Thing");
        assertEquals(StaEntityMapper.thingMapper(), resolve);
    }

    @Test
    void testThingName() {
        Mapper resolve = resolver.resolve("STA.Thing.name");
        assertEquals(new StaSimpleAttributeMapper<>("name", Thing::setName, EntityType.THING), resolve);
    }

    @Test
    void testThingProperty() {
        Mapper resolve = resolver.resolve("STA.Thing.properties[myKey]");
        assertSame(StaMapMapper.MapMapper.class, resolve.getClass());
    }
}
