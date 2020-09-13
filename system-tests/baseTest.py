import time
import unittest
from selenium import webdriver
from selenium.webdriver.firefox.options import Options

class BaseTest(unittest.TestCase):
    def navigate(self, path):
        self.driver.get("http://127.0.0.1:3001/" + path)
        time.sleep(4)
        self.driver.save_screenshot("screenshots/screenshot.png")

    @classmethod
    def setUpClass(cls):
        options = Options()
        #options.headless = True
        cls.driver = webdriver.Firefox(options=options)

        print("in setUpClass")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
        print("in tearDownClass")
