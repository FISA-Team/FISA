#!/bin/sh
pip3 install nose2 mock selenium
#docker-compose -f docker-compose.ci.yml up -d
cd system-tests
nose2 -v
