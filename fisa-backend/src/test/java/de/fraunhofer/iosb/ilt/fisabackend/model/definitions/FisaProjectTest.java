package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;

public class FisaProjectTest {
    private static final int EXAMPLE_LEAST_SIG_BIT = 4;
    private static final int EXAMPLE_MOST_SIG_BIT = 2;
    private static final int EXAMPLE_ID = 2020;

    private FisaDocument expectedFisaDoc;
    private boolean expectedGenerateExampleData;
    private String expectedName;
    private List<FisaObject> expectedFisaObjects;

    private FisaProject actual;

    @BeforeEach
    void setUp() {
        this.expectedFisaDoc = new FisaDocument();
        this.expectedGenerateExampleData = true;
        this.expectedName = "Test Name";
        this.expectedFisaObjects = new ArrayList<>();

        this.actual = new FisaProject(
                this.expectedFisaDoc,
                this.expectedGenerateExampleData,
                this.expectedName,
                this.expectedFisaObjects
        );
    }

    @Test
    void getFisaDocumentTest() {
        assertEquals(this.expectedFisaDoc, this.actual.getFisaDocument());
    }

    @Test
    void getGenerateExampleDataTest() {
        assertEquals(this.expectedGenerateExampleData, this.actual.getGenerateExampleData());
    }

    @Test
    void getNameTest() {
        assertEquals(this.expectedName, this.actual.getName());
    }

    @Test
    void getFisaObjectsTest() {
        assertEquals(this.expectedFisaObjects, this.actual.getFisaObjects());
    }

    @Test
    void setFisaDocumentTest() {
        FisaDocument testDoc = new FisaDocument(
                "Smart Home",
                new UUID(EXAMPLE_MOST_SIG_BIT, EXAMPLE_LEAST_SIG_BIT),
                new ArrayList<>(),
                new ArrayList<>()
        );

        this.expectedFisaDoc = testDoc;
        this.actual.setFisaDocument(testDoc);

        assertEquals(expectedFisaDoc, this.actual.getFisaDocument());
    }

    @Test
    void setGenerateExampleDataTest() {
        this.expectedGenerateExampleData = false;
        this.actual.setGenerateExampleData(false);

        assertEquals(expectedGenerateExampleData, this.actual.getGenerateExampleData());
    }

    @Test
    void setNameTest() {
        this.expectedName = "Name";
        this.actual.setName("Name");

        assertEquals(expectedName, this.actual.getName());
    }

    @Test
    void setFisaObjectsTest() {
        FisaObject testObject = new FisaObject(
                EXAMPLE_ID,
                "Kitchen",
                new ArrayList<>(),
                new ArrayList<>()
        );

        List<FisaObject> testList = new ArrayList<>();
        testList.add(testObject);

        this.expectedFisaObjects = testList;
        this.actual.setFisaObjects(testList);

        assertIterableEquals(expectedFisaObjects, this.actual.getFisaObjects());
    }



}
