package de.fraunhofer.iosb.ilt.fisabackend.service.converter;

import de.fraunhofer.iosb.ilt.fisabackend.model.SensorThingsApiBundle;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.ChildDefinition;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaDocument;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObject;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObjectAttribute;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObjectAttributeDefinition;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObjectDefinition;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaProject;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.DynamicMappingResolver;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.MappingResolver;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.StaMapper;
import de.fraunhofer.iosb.ilt.sta.ServiceFailureException;
import de.fraunhofer.iosb.ilt.sta.model.Datastream;
import de.fraunhofer.iosb.ilt.sta.model.Thing;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;

class FisaProjectToBundleConverterTest {

    private MappingResolver resolver;

    @BeforeEach
    void setUp() {
        var resolver = new DynamicMappingResolver();
        resolver.registerRootMapper("STA", new StaMapper());
        this.resolver = resolver;
    }


    @Test
    void testVerySimpleProjectConvert() {
        FisaProject project = getVerySimpleProject();
        FisaProjectToBundleConverter converter = new FisaProjectToBundleConverter(project, this.resolver);
        SensorThingsApiBundle bundle = converter.convertToBundle();
        Thing expected = new Thing();
        expected.setName("MyThing");
        assertIterableEquals(List.of(expected), bundle.getThings());
    }

    FisaProject getVerySimpleProject() {
        // definitions
        FisaObjectAttributeDefinition attrDef = new FisaObjectAttributeDefinition();
        attrDef.setName("defThingName");
        attrDef.setMapsTo("STA.Thing.name");
        FisaObjectDefinition objDef = new FisaObjectDefinition();
        objDef.setMapsTo("STA.Thing");
        objDef.setAttributes(List.of(attrDef));
        objDef.setName("defThing");

        // document
        FisaDocument document = new FisaDocument();
        document.setName("Test");
        document.setUuid(UUID.randomUUID());
        document.setObjectDefinitions(List.of(objDef));

        // values
        FisaObjectAttribute attr = new FisaObjectAttribute("defThingName", "MyThing");
        FisaObject object = new FisaObject();
        object.setDefinitionName("defThing");
        object.setId(1L);
        object.setAttributes(List.of(attr));

        //project
        FisaProject project = new FisaProject();
        project.setName("TestProject");
        project.setFisaDocument(document);
        project.setFisaObjects(List.of(object));
        return project;
    }

    @Test
    void testSimpleProjectConvert() throws ServiceFailureException {
        FisaProject project = getSimpleProject();
        FisaProjectToBundleConverter converter = new FisaProjectToBundleConverter(project, this.resolver);
        SensorThingsApiBundle bundle = converter.convertToBundle();
        Thing expectedThing = new Thing();
        expectedThing.setName("MyThing");
        Datastream expectedDatastream = new Datastream();
        expectedDatastream.setName("MyDatastream");
        assertIterableEquals(List.of(expectedThing), bundle.getThings());
        assertIterableEquals(List.of(expectedDatastream), bundle.getDatastreams());
        assertEquals(expectedThing, bundle.getDatastreams().get(0).getThing());
    }

    FisaProject getSimpleProject() {
        FisaProject project = getVerySimpleProject();

        // definitions
        FisaObjectAttributeDefinition attrDef = new FisaObjectAttributeDefinition();
        attrDef.setName("defDatastreamName");
        attrDef.setMapsTo("STA.Datastream.name");
        FisaObjectDefinition objDef = new FisaObjectDefinition();
        objDef.setMapsTo("STA.Datastream");
        objDef.setAttributes(List.of(attrDef));
        objDef.setName("defDatastream");
        objDef.setChildren(new ChildDefinition[]{
                new ChildDefinition("defThing", 1, "SomeText")
        });

        List<FisaObjectDefinition> defs = new ArrayList<>(project.getFisaDocument().getObjectDefinitions());
        defs.add(objDef);
        project.getFisaDocument().setObjectDefinitions(defs); // update

        FisaObjectAttribute attr = new FisaObjectAttribute("defDatastreamName", "MyDatastream");
        FisaObject object = new FisaObject();
        object.setDefinitionName("defDatastream");
        object.setAttributes(List.of(attr));
        object.setId(2L);
        object.setChildren(List.of(1L));
        List<FisaObject> fisaObjects = new ArrayList<>(project.getFisaObjects());
        fisaObjects.add(object);
        project.setFisaObjects(fisaObjects);
        return project;
    }

}