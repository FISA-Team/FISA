package de.fraunhofer.iosb.ilt.fisabackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaProject;
import de.fraunhofer.iosb.ilt.fisabackend.service.exception.ClientRequestException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * The repository managing FisaProjects stored as JSON.
 */
 class ProjectRepository {
    private String path; //path to folder containing Documents

    /**
     * Instantiates a new Project repository.
     *
     * @param path the directory where all files are stored
     * @throws IOException if directory creation fails
     */
    ProjectRepository(String path) throws IOException {
        this.path = path;
        //create filepath if it does not exist already
        Path pathvar = Paths.get(this.path);

        if (!Files.exists(pathvar)) {
            Files.createDirectory(pathvar);
        }
    }

    /**
     * Will return a FisaProject by it's uuid.
     *
     * @param uuid the uuid generated from the project name
     * @return the FisaProject matching the uuid
     * @throws IOException if jackson object mapper fails
     * @throws ClientRequestException if uuid cannot be matched to project file
     */
    FisaProject getProject(UUID uuid) throws IOException, ClientRequestException {
        String filename = this.path + File.separator + uuid.toString() + ".json";

        if (!Files.exists(Paths.get(filename))) {
            throw new ClientRequestException("Specified UUID does not exist in database");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(new File(filename), FisaProject.class);
    }

    /**
     * Will return a fisa document as file by it's uuid.
     *
     * @param uuid the uuid generated from the use-case name
     *
     * @return the fisa document matching the uuid as a file
     *
     * @throws ClientRequestException if uuid cannot be matched to use-case file
     */
    File getFisaProjectAsFile(UUID uuid) throws ClientRequestException {
        String filename = this.path + File.separator + uuid.toString() + ".json";

        if (!Files.exists(Paths.get(filename))) {
            throw new ClientRequestException("Specified UUID does not exist in database");
        }

        return new File(filename);
    }

    /**
     * Will create a List of projects currently available in repository.
     *
     * @return key value pair of uuid and name of the FisaProject
     * @throws IOException if jackson object mapper fails
     */
    Map<UUID, String> getProjectList() throws IOException {
        File folder = new File(this.path);
        File[] listOfFiles = folder.listFiles();
        ObjectMapper objectMapper = new ObjectMapper();

        Map<UUID, String> list = new HashMap<>();

        if (listOfFiles != null) {
            for (File file : listOfFiles) {
                if (file.isFile()) {
                    //getFisaProject
                    FisaProject fisaProject = objectMapper.readValue(file, FisaProject.class);

                    UUID uuid = UUID.nameUUIDFromBytes(fisaProject.getName().getBytes());
                    String name = fisaProject.getName();
                    list.put(uuid, name);
                }
            }
        }
        return list;
    }

    /**
     * Stores a FisaProject as JSON file in repository.
     *
     * @param project the FisaProject that will be stored as JSON file
     * @throws IOException if jackson object mapper fails
     * @throws ClientRequestException if name of project in document matches name of project in repository
     */
    void saveProject(FisaProject project) throws IOException, ClientRequestException {
        String filename = this.path + File.separator
                          + UUID.nameUUIDFromBytes(project.getName().getBytes()).toString() + ".json";

        File file = new File(filename);

        if (file.exists()) {
            throw new ClientRequestException("Name of project already exists in Repository");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, project);
    }

    /**
     * Deletes a FisaProject that has been stored in repository.
     *
     * @param uuid the uuid of the FisaProject that will be deleted
     * @throws ClientRequestException if uuid cannot be matched with file in repository
     * @throws IOException if file deletion process failed
     */
    void deleteProject(UUID uuid) throws IOException, ClientRequestException {
        String filename = this.path + File.separator + uuid.toString() + ".json";
        //delete found file if exists
        if (!Files.exists(Paths.get(filename))) {
            throw new ClientRequestException("Specified UUID cannot be matched with project in database");
        }
        File deleteFile = new File(filename);
        if (!deleteFile.delete()) {
            throw new IOException("File matching use case was found but could not be removed.");
        }
    }

}
