package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;

public class FisaObjectDefinitionTest {

    private String expectedName;
    private String expectedInfoText;
    private boolean expectedIsTopLayer;
    private String expectedMapsTo;
    private List<FisaObjectAttributeDefinition> expectedAttributes;
    private ExampleData expectedExampleData;
    private ChildDefinition[] expectedChildren;
    private String[] expectedPositionAttributes;
    private String expectedCaption;
    private boolean expectedIsNotReusable;


    private FisaObjectDefinition actual;

    @BeforeEach
    void setUp() {
        this.expectedName = "Room";
        this.expectedInfoText = "A Basic Room";
        this.expectedIsTopLayer = false;
        this.expectedMapsTo = "Thing";
        this.expectedAttributes = new ArrayList<>();
        this.expectedChildren = new ChildDefinition[5];
        this.expectedExampleData = new ExampleData();
        this.expectedPositionAttributes = new String[]{"1", "5"};
        this.expectedCaption = "Etwas";
        this.expectedIsNotReusable = false;

        this.actual = new FisaObjectDefinition(
                this.expectedName,
                this.expectedInfoText,
                this.expectedIsTopLayer,
                this.expectedMapsTo,
                this.expectedAttributes,
                this.expectedExampleData,
                this.expectedChildren,
                this.expectedPositionAttributes,
                this.expectedCaption,
                expectedIsNotReusable);
    }

    @Test
    void getNameTest() {
        assertEquals(this.expectedName, this.actual.getName());
    }

    @Test
    void getInfoTextTest() {
        assertEquals(this.expectedInfoText, this.actual.getInfoText());
    }

    @Test
    void isTopLayerTest() {
        assertEquals(this.expectedIsTopLayer, this.actual.getIsTopLayer());
    }

    @Test
    void mapsTo() {
        assertEquals(this.expectedMapsTo, this.actual.getMapsTo());
    }

    @Test
    void getAttributesTest() {
        assertIterableEquals(this.expectedAttributes, this.actual.getAttributes());
    }

    @Test
    void getChildrenTest() {
        assertEquals(this.expectedChildren, this.actual.getChildren());
    }

    @Test
    void getExampleDataTest() {
        assertEquals(this.expectedExampleData, this.actual.getExampleData());
    }

    @Test
    void getPositionAttributesTest() {
        assertEquals(this.expectedPositionAttributes, this.actual.getPositionAttributes());
    }

    @Test
    void getCaptionTest() {
        assertEquals(this.expectedCaption, this.actual.getCaption());
    }

    @Test
    void setNameTest() {
        this.expectedName = "Garden";

        this.actual.setName("Garden");

        assertEquals(this.expectedName, this.actual.getName());
    }

    @Test
    void setInfoTextTest() {
        this.expectedInfoText = "A Normal Garden";

        this.actual.setInfoText("A Normal Garden");

        assertEquals(this.expectedInfoText, this.actual.getInfoText());
    }

    @Test
    void setIsTopLayerTest() {
        this.expectedIsTopLayer = true;

        this.actual.setIsTopLayer(true);

        assertEquals(this.expectedIsTopLayer, this.actual.getIsTopLayer());
    }

    @Test
    void setMapsToTest() {
        this.expectedMapsTo = "Location";

        this.actual.setMapsTo("Location");

        assertEquals(this.expectedMapsTo, this.actual.getMapsTo());
    }

    @Test
    void setAttributesTest() {
        List<FisaObjectAttributeDefinition> testList = new ArrayList<>();
        FisaObjectAttributeDefinition testDefinition = new FisaObjectAttributeDefinition(
                "Location",
                "Enter Your Location",
                "String",
                "Adenauerring 2",
                false,
                new ArrayList<>(),
                "STA.Location",
                "[A-z]([a-z]+)"
        );

        this.expectedAttributes.add(testDefinition);
        testList.add(testDefinition);
        this.actual.setAttributes(testList);

        assertIterableEquals(this.expectedAttributes, this.actual.getAttributes());
    }

    @Test
    void setChildrenTest() {
        ChildDefinition testChild = new ChildDefinition(
                "Fridge",
                5,
                "A Generic Fridge"
        );

        ChildDefinition[] testArray = {testChild};

        this.expectedChildren = testArray;
        this.actual.setChildren(testArray);

        assertEquals(this.expectedChildren, this.actual.getChildren());
    }

    @Test
    void setExampleDataTest() {
        ExampleData testData = new ExampleData(
                5,
                -5,
                5,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        this.expectedExampleData = testData;
        this.actual.setExampleData(testData);

        assertEquals(this.expectedExampleData, this.actual.getExampleData());
    }

    @Test
    void setPositionAttributesTest() {
        String[] position = new String[]{"1", "1"};

        this.expectedPositionAttributes = position;
        this.actual.setPositionAttributes(position);

        assertEquals(this.expectedPositionAttributes, this.actual.getPositionAttributes());
    }

    @Test
    void setCaptionTest() {
        this.expectedCaption = "test";
        this.actual.setCaption("test");

        assertEquals(this.expectedCaption, this.actual.getCaption());
    }
}
