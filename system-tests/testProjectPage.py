import time
from baseTest import BaseTest

projectName = "My Project"

class TestProjectPage(BaseTest):

    def createProject(self):
        self.navigate("")
        # Open create project menu
        self.driver.find_element_by_xpath("/html/body/div/div/div/div/div[1]/button").click()
        time.sleep(0.2)
        # select SmartHome usecase
        self.driver.find_element_by_xpath('/html/body/div[2]/div[3]/div/div[2]/div/div[2]/nav').click()
        time.sleep(0.2)
        # click next
        self.driver.find_element_by_xpath('/html/body/div[2]/div[3]/div/div[3]/button[2]').click()
        time.sleep(0.2)
        # Enter project name
        self.driver.find_element_by_xpath('//*[@id="standard-basic"]').send_keys(projectName)
        time.sleep(0.2)
        # click create
        self.driver.find_element_by_xpath('/html/body/div[2]/div[3]/div/div/div[3]/button[2]').click()
        time.sleep(0.2)
        assert self.driver.current_url.endswith('project')

    def test_createProject(self):
        self.createProject()

    def test_changeLocation(self):
        self.createProject()
        # Check if Rooms is at the top of the page
        objectCaption = self.driver.find_element_by_xpath('/html/body/div[1]/div/div/div/div[2]/div/div[2]/div/div/div[1]/div[1]/ul/li/div/h5').text
        assert objectCaption == "Rooms"

        # Navigate to Temperature in the Tree-Overview
        self.driver.find_element_by_xpath('/html/body/div[1]/div/div/div/div[1]/div/div[1]/ul/li/ul/div/div/li[2]/div/div[2]/li').click()
        time.sleep(0.2)

        # Check if Datastreams is at the top of the page
        objectCaption = self.driver.find_element_by_xpath('/html/body/div[1]/div/div/div/div[2]/div/div[2]/div/div[1]/div[1]/div[1]/ul/li/div/h5').text
        assert objectCaption == "Datastreams"

        # Click on "Observed Property's" in the categorical overview
        self.driver.find_element_by_xpath('/html/body/div[1]/div/div/div/div[3]/div/div[2]/div[3]/div[1]/div[2]').click()
        time.sleep(0.2)

        # Click on "Base,emt temperature"
        self.driver.find_element_by_xpath('/html/body/div[1]/div/div/div/div[3]/div/div[2]/div[3]/div[2]/div/div/div/div/div/button').click()
        time.sleep(0.2)

        # Check if "Observed property's" is at the top of the page
        objectCaption = self.driver.find_element_by_xpath('/html/body/div[1]/div/div/div/div[2]/div/div[2]/div/div[1]/div[1]/div[1]/ul/li/div/h5').text
        assert objectCaption == "Observed property's"

    def test_goBackToMainPage(self):
        self.createProject()

        # navigate to MainPage
        self.driver.find_element_by_xpath('/html/body/div[1]/div/div/header/div/a/button').click()
        time.sleep(0.2)

        assert not self.driver.current_url.endswith('project')

        # check for elements in mainPage
        manageUsecases = self.driver.find_element_by_xpath('/html/body/div/div/div/div/div[2]/h4').text
        assert manageUsecases == 'Manage Use-Cases'

    def test_manipulateObjects(self):
        self.createProject()

        # Navigate to Temperature
        self.driver.find_element_by_xpath('/html/body/div[1]/div/div/div/div[1]/div/div[1]/ul/li/ul/div/div/li[2]/div/div[2]/li').click()
        time.sleep(0.2)

        # change name of Temperature
        self.driver.find_element_by_xpath('//*[@id="standard-basic"]').clear()
        time.sleep(0.2)
        self.driver.find_element_by_xpath('//*[@id="standard-basic"]').send_keys("NewName")
        time.sleep(0.2)

        # Check if it changed
        newName = self.driver.find_element_by_xpath('//*[@id="standard-basic"]').get_attribute("value")

        assert newName == "NewName"

         # Check Number of childrens before removed
        grid = self.driver.find_element_by_xpath('/html/body/div[1]/div/div/div/div[2]/div/div[2]/div/div[1]/div[2]/div/div/div/div/div')
        allChildren = grid.find_elements_by_xpath(".//*")
        assert len(allChildren) == 55

        # Click removeObject
        self.driver.find_element_by_xpath('/html/body/div[1]/div/div/div/div[2]/div/div[2]/div/div[1]/div[2]/div/div/div/div/div/div[1]/div/div/div[1]/div[2]/button').click()
        time.sleep(0.2)

        # Assign to delete the object
        self.driver.find_element_by_xpath('/html/body/div[7]/div[3]/div/div[2]/button[2]').click()
        time.sleep(0.2)

        # Check Number of childrens after removed
        grid = self.driver.find_element_by_xpath('/html/body/div[1]/div/div/div/div[2]/div/div[2]/div/div[1]/div[2]/div/div/div/div/div')
       

        allChildren = grid.find_elements_by_xpath(".//*")
        assert len(allChildren) == 7
        
        # click on add button
        self.driver.find_element_by_xpath('/html/body/div[1]/div/div/div/div[2]/div/div[2]/div/div[1]/div[2]/div/div/div/div/div/div/div/button').click()
        time.sleep(0.2)

        # Check Number of childrens after removed
        grid = self.driver.find_element_by_xpath('/html/body/div[1]/div/div/div/div[2]/div/div[2]/div/div[1]/div[2]/div/div/div/div/div')
        allChildren = grid.find_elements_by_xpath(".//*")
        assert len(allChildren) == 55

    def test_saveProject(self):
        self.createProject()

        # click on save Project
        self.driver.find_element_by_xpath('/html/body/div[1]/div/div/header/div/div[2]/button[1]').click()
        time.sleep(0.2)

        # click on Save
        self.driver.find_element_by_xpath('/html/body/div[7]/div[3]/div/div[3]/button[2]').click()
        time.sleep(0.2)

        # navigate to MainPage
        self.driver.find_element_by_xpath('/html/body/div[1]/div/div/header/div/a/button').click()
        time.sleep(0.2)

        # get name of first Object in list
        savedProjectName = self.driver.find_element_by_xpath('/html/body/div/div/div/div/div[1]/div[2]/nav/div/div/div/span').text

        assert savedProjectName == projectName

        # remove the Project
        self.driver.find_element_by_xpath('/html/body/div/div/div/div/div[1]/div[2]/nav/div/div/button[2]').click()
        time.sleep(0.2)

        # confirme
        self.driver.find_element_by_xpath('/html/body/div[2]/div[3]/div/div[2]/button[2]').click()
        time.sleep(0.2)

    



