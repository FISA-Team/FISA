package de.fraunhofer.iosb.ilt.fisabackend.service;

import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaProject;
import de.fraunhofer.iosb.ilt.fisabackend.service.exception.ClientRequestException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

/**
 * The Project service manages all requested operations from the frontend of the application related to the
 * FisaProject.
 */
public class ProjectService {

    private ProjectRepository repo;

    /**
     * Instantiates a new Project service. Default path is a subdirectory called ProjectRepository located
     * inside the application dir
     *
     * @param fisaFilesDirectory path to repository
     * @throws IOException if creating a new ProjectRepository fails
     */
    public ProjectService(String fisaFilesDirectory) throws IOException {
        if (fisaFilesDirectory == null) {
            fisaFilesDirectory = "";
        }
        Path currentRelativePath = Paths.get(fisaFilesDirectory);
        String dir = currentRelativePath.toAbsolutePath().toString() + File.separator + "ProjectRepository";
        repo = new ProjectRepository(dir);
    }

    /**
     *
     * Will return a fisa project by it's uuid.
     *
     * @param uuid the uuid generated from the project name
     * @return the fisa project matching the uuid
     * @throws IOException If ProjectRepository operation failed
     * @throws ClientRequestException if no file matches uuid
     */
    public FisaProject getProject(UUID uuid) throws IOException, ClientRequestException {
        return repo.getProject(uuid);
    }

    /**
     *
     * Will return a fisa project as file by it's uuid.
     *
     * @param uuid the uuid generated from the use-case name
     * @return the fisa document matching the uuid
     * @throws ClientRequestException if uuid cannot be found in repo
     */
    public File getProjectAsFile(UUID uuid) throws ClientRequestException {
        return repo.getFisaProjectAsFile(uuid);
    }

    /**
     * Will create a List of Projects currently available in Repository.
     *
     * @return key value pair of uuid and name of the FisaProject
     * @throws IOException if ProjectRepository operation failed
     */
    public Map<UUID, String> listProjects() throws IOException {
        return repo.getProjectList();
    }

    /**
     * Saves a FisaProject in the Project Repository.
     *
     * @param project The FisaProject that has to be stored
     * @throws IOException if ProjectRepository operation failed
     * @throws ClientRequestException if project name is already occupied
     */
    public void createProject(FisaProject project) throws IOException, ClientRequestException {
        repo.saveProject(project);
    }

    /**
     * removes a FisaProject from the repository.
     *
     * @param uuid the uuid of the FisaProject that has to be removed
     * @throws IOException if ProjectRepository operation failed
     * @throws ClientRequestException if no file matches uuid
     */
    public void deleteProject(UUID uuid) throws IOException, ClientRequestException {
        repo.deleteProject(uuid);
    }

    /**
     * updates a FisaProject at the repository.
     *
     * @param project new version of the project to be updated
     * @throws IOException if ProjectRepository operation failed
     * @throws ClientRequestException if project could not be found on repository
     */
    public void updateProject(FisaProject project) throws IOException, ClientRequestException {
        UUID uuid = UUID.nameUUIDFromBytes(project.getName().getBytes());
        FisaProject oldVersion = getProject(uuid);
        this.deleteProject(uuid);
        try {
            this.createProject(project);
        } catch (IOException e) {
            this.createProject(oldVersion);
            throw e;
        }
    }
}
