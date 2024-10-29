# Kind Giving Application

## Setup

- Run `docker compose build` to build the docker images
- Run `docker compose run --rm backend sh -c "python manage.py createsuperuser"` to create a superuser
- Run `docker compose up` to start the containers
- Run `docker compose down` to stop the containers

## Backend

- Django
- Django Rest Framework
- PostgreSQL

- localhost:8000/admin - Django admin

## Frontend

- React

- Run `npm install` to install the dependencies so that your IDE can recognize them
- Don't run `npm start` as the frontend is served in the frontend container

- localhost - React application

## Questions

- paypal-integration:
    Paypal Developer has a few [APIs](https://developer.paypal.com/api/rest/current-resources/) that we can work with.

    Both these examples need you to create a paypal dev account and transactions
    can be mocked in the Paypal Sandbox:
    - [backend integration example](https://www.youtube.com/watch?v=IXxEdhA7fig)
    - [frontend integration example](https://www.youtube.com/watch?v=f7NWToOjtKI)
