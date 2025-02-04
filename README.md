# Kind Giving Application

## Setup

- Run `docker compose build` to build the docker images
- Run `docker compose up` to start the containers
- Run `docker compose down` to stop the containers

## Backend

- Django
- Django Rest Framework
- PostgreSQL

### Important URLs

- localhost:8000/admin - Django admin

### Installing Project Dependencies

1. Add the library to requirements.txt (or requirement.dev.txt)
2. Run `docker compose build backend` to ensure the container
   environment is rebuilt with the new dependencies
3. (Optional) some packages will not take effect until the are added
   to the project `settings.py` under `INSTALLED_APPS`.
4. (Optional) some packages will not take effect even after that until
   their migrations are applied to the project database.
   Run migrations, see [Database Management](#database-management).

### Database Management

- makemigrations: `docker compose run --rm backend sh -c "python
manage.py makemigrations"`
- migrate: `docker compose run --rm backend sh -c "python manage.py migrate"`

### Linting, Formatting and Fixing Lint/Format Errors

1. Ensure `pre-commit` is available on PATH

   For python lovers: `pip install pre-commit`
   For homebrew (macOS): `brew install pre-commit`

1. Run `pre-commit run --all-files`

   On your first run some checks may fail with a note about the
   corrective measures the autofixer will execute, just run again to
   make sure all tests pass.

### Testing

- To run all tests: `docker compose run --rm backend sh -c "python
manage.py test"`
- To run all tests for `<some-app>`: `docker compose run --rm backend
sh -c "python manage.py test <some-app>"`

## Frontend

- React

- Don't run `npm start` or `npm run dev` locally as the frontend is served in the frontend container
- If you need to install new libraries/packages, use the command `docker compose run --rm frontend sh -c "npm install <name_of_library>"`
- The project uses ESLint for linting and Prettier for code formatting. Configuration files are included in the repository.

### ESLint Setup

#### VSCode Users

Install these extensions:

- ESLint
- Prettier - Code formatter
- EditorConfig for VS Code

#### Other Editors

Install your editor's equivalent plugins/packages for:

- ESLint
- Prettier
- EditorConfig

### Available Commands

```bash
# Format all files
npm run format

# Lint and fix all files
npm run lint

# Run both format and lint
npm run fix
```

Files will be automatically formatted on save if your editor is configured correctly.

## Questions

- paypal-integration:
  Paypal Developer has a few [APIs](https://developer.paypal.com/api/rest/current-resources/) that we can work with.

  Both these examples need you to create a paypal dev account and transactions
  can be mocked in the Paypal Sandbox:

  - [backend integration example](https://www.youtube.com/watch?v=IXxEdhA7fig)
  - [frontend integration example](https://www.youtube.com/watch?v=f7NWToOjtKI)
