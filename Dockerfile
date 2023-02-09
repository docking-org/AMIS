FROM node:16-alpine as frontend-amis
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json yarn.lock ./
COPY ./src ./src
COPY ./public ./public
RUN yarn install
RUN yarn build


FROM continuumio/anaconda3:latest as backend-amis
WORKDIR /home/amis
COPY --from=frontend-amis /app/build ../build
COPY ./backend ./
ADD backend/application.py backend/config.py backend/boot.sh backend/requirements.txt ./
RUN conda create -n amis -y
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

RUN pip install -r backend/requirements.txt
RUN apt-get install ffmpeg libsm6 libxext6  -y

ADD backend/app ./app
RUN chmod +x boot.sh
EXPOSE 5000


ENTRYPOINT ["./boot.sh"]