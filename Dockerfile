FROM openkbs/webstorm-vnc-docker

ADD . .

RUN sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
RUN sudo apt-get update
RUN sudo pip install docker-compose==1.23.2 selenium nose2 mock
RUN sudo apt-get install docker-ce docker-ce-cli containerd.io firefox --allow-unauthenticated -y -qq
 
RUN wget https://github.com/mozilla/geckodriver/releases/download/v0.27.0/geckodriver-v0.27.0-linux64.tar.gz
RUN sudo tar -zxf geckodriver-v0.27.0-linux64.tar.gz -C /usr/bin

ENTRYPOINT ["/home/developer/run-tests.sh"]
