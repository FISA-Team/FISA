import time
import unittest
from baseTest import BaseTest

class TestMainPage(BaseTest):
    def test_MainPageHeading(self):
        self.navigate("")

        assert "FISA" in self.driver.title
        self.driver.find_element_by_id('projectHeading')
    
    def test_ChangeThemes(self):
        # Light theme to dark theme
        self.navigate("")
        self.driver.find_element_by_id('themeLanguageMenu').click()
        time.sleep(0.2)
        self.driver.find_element_by_xpath('/html/body/div[2]/div[3]/ul/fieldset/div[1]/label[2]/span[1]/span[1]/input').click()
        time.sleep(0.2)
        color = self.driver.find_element_by_xpath('/html/body/div/div/div/div/div[1]').value_of_css_property('background-color')
        assert color == 'rgb(44, 49, 58)'

        # dark theme to light theme
        self.driver.find_element_by_id('themeLanguageMenu').click()
        time.sleep(0.2)
        self.driver.find_element_by_xpath('/html/body/div[2]/div[3]/ul/fieldset/div[1]/label[1]/span[1]').click()
        time.sleep(0.2)
        color = self.driver.find_element_by_xpath('/html/body/div/div/div/div/div[1]').value_of_css_property('background-color')
        assert color == 'rgb(242, 242, 242)'

    def test_ChangeLanguages(self):
        # EN to DE
        self.navigate("")
        manageUsecases = self.driver.find_element_by_xpath('/html/body/div/div/div/div/div[2]/h4').text
        assert manageUsecases == 'Manage Use-Cases'

        self.driver.find_element_by_id('themeLanguageMenu').click()
        time.sleep(0.2)
        self.driver.find_element_by_xpath('/html/body/div[2]/div[3]/ul/fieldset/div[2]/label[2]/span[1]/span[1]/input').click()
        time.sleep(0.2)
        
        manageUsecases = self.driver.find_element_by_xpath('/html/body/div/div/div/div/div[2]/h4').text
        assert manageUsecases == 'Verwalte Anwendungszenarien'

        # DE to EN
        self.driver.find_element_by_id('themeLanguageMenu').click()
        time.sleep(0.2)
        self.driver.find_element_by_xpath('/html/body/div[2]/div[3]/ul/fieldset/div[2]/label[1]/span[1]/span[1]/input').click()
        time.sleep(0.2)
        
        manageUsecases = self.driver.find_element_by_xpath('/html/body/div/div/div/div/div[2]/h4').text
        assert manageUsecases == 'Manage Use-Cases'

    def test_openDeveloperMenu(self):
        self.navigate("")

        self.driver.find_element_by_xpath('/html/body/div/div/div/div/div[2]/button').click()
        time.sleep(0.2)

        developerMenuHeading = self.driver.find_element_by_xpath('/html/body/div[2]/div[3]/div/div[1]/h2').text
        assert developerMenuHeading == "Developer-Menu"