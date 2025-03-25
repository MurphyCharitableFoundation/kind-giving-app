# Kind Giving Application

## Setup

- Ensure to set up project configurations in `.env` file, check `.env.example`
- Run `docker compose build` to build the docker images
- Run `docker compose up` to start the containers
- Run `docker compose down` to stop the containers

## Task Management 

### Creating Tasks: Writing User Stories

Each development task must have a user-story, description, and
acceptance-criteria (i.e what it means for the task to be done).

```markdown

  **User Story**
  As a user, I want to create a campaign for a given project, so that I can support and garner support for the project.

  **Description**
  A Campaign is how users donate to a Project. A Project can have multiple Campaigns, but a Campaign can only support a single Project.

  **Acceptance Criteria**
  - fields: check ERD - https://lucid.app/lucidchart/a695fb42-6184-4905-914c-1feb7d5befbb/edit?invitationId=inv_0e8f6605-eeec-4e99-932e-207667b6ae21&page=0_0#
  - func to create campaign; given project, owner, title, description: optional, end_date: optional

```

### Taking on Tasks: Contributing to the Project

Models are arranged into apps; similarly, tasks about apps contain
tasks about models as sub-issues.

Always check if a task has a parent-issue before tackling it.

For example:
(Task: create campaign model) is a sub-issue under (Task: create campaign app)

If you were to take on the tasks; take it on at the app level and
complete the associated sub-issues (i.e also tackle Task: create
campaign model & Task: create comment model)

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
   
### Loading Database Fixtures (i.e. sample data)

1. Load bank accounts: 

    ```
    docker compose run --rm backend sh -c "python manage.py loaddata sample_data/project.json"
    ```

1. Load groups, users and user groups: 

    ```
    docker compose run --rm backend sh -c "python manage.py loaddata sample_data/groups_users_and_usergroups.json"
    ```

1. Load projects: 

    ```
    docker compose run --rm backend sh -c "python manage.py loaddata sample_data/project.json"
    ```


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
docker compose run --rm frontend sh -c "npm run format"

# Lint and fix all files
docker compose run --rm frontend sh -c "npm run lint"

# Run both format and lint
docker compose run --rm frontend sh -c "npm run fix"
```

Files will be automatically formatted on save if your editor is
configured correctly.
