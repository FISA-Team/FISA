package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;

public class FisaDocumentTest {

    private String expectedName;
    private UUID expectedUuid;
    private List<FisaObjectDefinition> expectedObjectDefinitions;
    private List<FisaObject> expectedFisaTemplate;

    private FisaDocument actual;

    @BeforeEach
    void setUp() {
        this.expectedName = "Smart Home";
        this.expectedUuid = new UUID(2, 4);
        this.expectedObjectDefinitions = new ArrayList<>();
        this.expectedFisaTemplate = new ArrayList<>();

        this.actual = new FisaDocument(
                this.expectedName,
                this.expectedUuid,
                this.expectedObjectDefinitions,
                this.expectedFisaTemplate
        );
    }

    @Test
    void getNameTest() {
        this.actual.setName(this.expectedName);

        assertEquals(this.expectedName, this.actual.getName());
    }

    @Test
    void getUuidTest() {
        this.actual.setUuid(this.expectedUuid);

        assertEquals(this.expectedUuid, this.actual.getUuid());
    }

    @Test
    void getObjectDefinitionsTest() {
        this.actual.setObjectDefinitions(new ArrayList<>());

        assertIterableEquals(this.expectedObjectDefinitions, this.actual.getObjectDefinitions());
    }

    @Test
    void getFisaTemplateTest() {
        assertIterableEquals(this.expectedFisaTemplate, this.actual.getFisaTemplate());
    }

    @Test
    void setNameTest() {
        this.actual.setName(this.expectedName);

        assertEquals(this.expectedName, this.actual.getName());
    }

    @Test
    void setUuidTest() {
        this.actual.setUuid(this.expectedUuid);

        assertEquals(this.expectedUuid, this.actual.getUuid());
    }

    @Test
    void setObjectDefinitionsTest() {
        FisaObjectDefinition testDefinition = new FisaObjectDefinition();

        this.expectedObjectDefinitions.add(testDefinition);
        this.actual.setObjectDefinitions(this.expectedObjectDefinitions);

        assertIterableEquals(this.expectedObjectDefinitions, this.actual.getObjectDefinitions());
    }

    @Test
    void setFisaTemplateTest() {
        List<FisaObject> testTemplate = new ArrayList<>();
        testTemplate.add(new FisaObject());

        this.expectedFisaTemplate = testTemplate;
        this.actual.setFisaTemplate(testTemplate);

        assertIterableEquals(testTemplate, this.actual.getFisaTemplate());
    }
}
