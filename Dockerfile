# syntax=docker/dockerfile:1.4

FROM node:16-alpine as frontend
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
RUN npm install
COPY ./src ./src
COPY ./public ./public
RUN yarn build


FROM continuumio/anaconda3:latest as backend
WORKDIR /home/amis
ADD backend/application.py backend/config.py backend/boot.sh backend/requirements.txt ./
RUN conda create -n amis -y python=3.7
RUN echo "conda activate amis" > ~/.bashrc

ENV PATH /opt/conda/envs/amis/bin:$PATH
ENV SECRET_KEY $SECRET_KEY
ENV SQLALCHEMY_DATABASE_URI $SQLALCHEMY_DATABASE_URI
ENV UPLOAD_FOLDER $UPLOAD_FOLDER
ENV IMAGE_LOAD_FOLDER $IMAGE_LOAD_FOLDER
ENV IMG_UPLOAD_FOLDER_URL $IMG_UPLOAD_FOLDER_URL
ENV JPEG_FOLDER $JPEG_FOLDER
ENV JPG_FOLDER $JPG_FOLDER

RUN apt-get update
RUN apt-get install -y gcc
RUN apt-get install -y libpq-dev 
RUN apt-get install -y python-dev 
RUN apt-get install -y vim

RUN pip install -r ./requirements.txt
RUN apt-get install ffmpeg libsm6 libxext6  -y

COPY --from=frontend /app/build ../build
ADD backend ./
RUN chmod 777 boot.sh
EXPOSE 5000
ENTRYPOINT ["./boot.sh"]