FROM continuumio/anaconda3:latest

WORKDIR /home/amis

ADD application.py config.py boot.sh requirements.txt ./
RUN conda create -n amis -y
RUN echo "conda activate amis" > ~/.bashrc
ENV PATH /opt/conda/envs/amis/bin:$PATH
RUN pip install -r requirements.txt

RUN apt-get update

RUN apt-get install -y vim

ADD app app
RUN chmod +x boot.sh
EXPOSE 5000
ENTRYPOINT ["./boot.sh"]