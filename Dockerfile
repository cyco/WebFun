FROM nginx:alpine

ADD build/ /usr/share/nginx/html/
ADD assets/ /usr/share/nginx/html/
