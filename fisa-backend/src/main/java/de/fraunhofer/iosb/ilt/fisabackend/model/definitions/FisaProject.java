package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import java.util.List;

/**
 * The FisaProject represents a project of a "domain-user" (german: "Fachanwender").
 */
public class FisaProject {

    private FisaDocument fisaDocument;
    private boolean generateExampleData;
    private String name;
    private List<FisaObject> fisaObjects;

    /**
     * The default constructor of FisaProject.
     */
    public FisaProject() {
    }

    /**
     * Instantiates a new FisaProject.
     *
     * @param fisaDocument The underlying FisaDocument of the FisaProject
     * @param generateExampleData Boolean value to flag, if exemplary data shall be generated
     * @param name The name of the FisaProject
     * @param fisaObjects List of FisaObject of the FisaProject
     */
    public FisaProject(
            FisaDocument fisaDocument,
            boolean generateExampleData,
            String name,
            List<FisaObject> fisaObjects
    ) {
        this.fisaDocument = fisaDocument;
        this.generateExampleData = generateExampleData;
        this.name = name;
        this.fisaObjects = fisaObjects;
    }

    /**
     * Returns the FisaDocument of the FisaProject.
     *
     * @return FisaDocument
     */
    public FisaDocument getFisaDocument() {
        return this.fisaDocument;
    }

    /**
     * Returns the boolean flag for data generation.
     *
     * @return Boolean value for data generation
     */
    public boolean getGenerateExampleData() {
        return this.generateExampleData;
    }

    /**
     * Returns the name of the FisaProject.
     *
     * @return Name
     */
    public String getName() {
        return this.name;
    }

    /**
     * Returns a list of FisaObject of the FisaProject.
     *
     * @return List of FisaObject
     */
    public List<FisaObject> getFisaObjects() {
        return this.fisaObjects;
    }

    /**
     * Sets the underlying FisaDocument.
     *
     * @param fisaDocument FisaDocument to be placed
     */
    public void setFisaDocument(FisaDocument fisaDocument) {
        this.fisaDocument = fisaDocument;
    }

    /**
     * Sets the boolean flag to generate exemplary data.
     *
     * @param generateExampleData Boolean to generate data
     */
    public void setGenerateExampleData(boolean generateExampleData) {
        this.generateExampleData = generateExampleData;
    }

    /**
     * Sets the name of the FisaProject.
     *
     * @param name Name of the FisaProject
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Sets the list of FisaObject of the FisaProject.
     *
     * @param fisaObjects List of FisaObject
     */
    public void setFisaObjects(List<FisaObject> fisaObjects) {
        this.fisaObjects = fisaObjects;
    }
}
