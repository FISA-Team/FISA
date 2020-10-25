package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import java.util.List;

/**
 * The FisaProject represents a project of a "domain-user" (german: "Fachanwender").
 */
public class FisaProject {

    private String connectedFrostServer;
    private FisaDocument fisaDocument;
    private boolean generateExampleData;
    private String name;
    private List<FisaObject> fisaObjects;
    private List<FisaObject> removedFisaObjects;

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
     * returns the url of the connected FROST-Server
     *
     * @return the url of the connected FROST-Server or null
     */
    public String getConnectedFrostServer() {
        return connectedFrostServer;
    }

    /**
     * returns the list of removed Fisa-Objects
     *
     * @return the list of removed Fisa-Objects
     */
    public List<FisaObject> getRemovedFisaObjects() {
        return this.removedFisaObjects;
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

    /**
     * Sets the url of the connected FROST-Server
     *
     * @param connectedFrostServer The URL of the connected FROST-Server
     */
    public void setConnectedFrostServer(String connectedFrostServer) {
        this.connectedFrostServer = connectedFrostServer;
    }

    /**
     * Sets the list of removed FisaObject of the FisaProject.
     *
     * @param removedFisaObjects List of FisaObjects to remove
     */
    public void setRemovedFisaObjects(List<FisaObject> removedFisaObjects) {
        this.removedFisaObjects = removedFisaObjects;
    }
}
