import time
import unittest
from baseTest import BaseTest

class TestMainMenu(BaseTest):
    def test_MainPageHeading(self):
        self.navigate("")

        assert "FISA" in self.driver.title
        self.driver.find_element_by_id('projectHeading')