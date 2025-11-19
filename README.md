# Kind Giving Application

The Kind Giving Application is like most fundraising web-based
applications. It is written by volunteers who want to support the
Murphy Charitable Foundations' (MCF) goal of supporting those in need
in Uganda.

Start with the Docs, and use the sections as you need. 

Thanks for joining the team!

## Docs

The docs folder contains a c4 representation of the kind giving
application. You can render it on structurizr or any other web
platform that supports the C4 DSL (domain-specific language) to get a
big picture view of the application as a system that will help the MCF
achieve it's goals.

[Something](https://structurizr.com/dsl?src=https://docs.structurizr.com/dsl/tutorial/5.dsl)

To render the diagram:
1. Open the [Structurizr Tutorial](https://structurizr.com/dsl?src=https://docs.structurizr.com/dsl/tutorial/5.dsl) on your web browser.
2. Click the 'view source' button at the top of the page.
3. Copy and paste the c4-model.dsl contents into the text editor on the left.
4. Click the 'render' button in the task bar at the top of the editor.
5. The rendition will look mumbled, that is ok. Click the 'magic-wand'
   button at the top right on the right side of the page.
6. Click the 'auto-layout' button on at the bottom of the confirmation
   dialog.
   
At this point, the rendition will look much better. It will show the
architecture diagram at 3 levels:
- landscape: all interacting users/systems (i.e. Staff, Registered Users, ...)
- systems: all major systems (i.e. Kind Giving System & Payment
  Systems)
- containers: all containers within systems (i.e. PostgresQL inside
  the Kind Giving System)

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

- `localhost:8000/admin` - Django admin
- `localhost:8000/api/schema/` - Kind Giving App. API Schema as YAML
- `localhost:8000/api/schema/swagger-ui` - Kind Giving App. API Schema served on Swagger UI
- `localhost:8000/api/schema/redoc` - Kind Giving App. API Schema served on Redoc UI

### API Docs/Schema
#### Generating Schema as YAML

Run the following command to verify and generate a schema file
describing the JSON API exposed by the Kind Giving Application.

```

docker compose exec backend sh -c "python manage.py spectacular --color --file schema.yml"

```

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

- makemigrations: `docker compose exec backend sh -c "python
manage.py makemigrations"`
- migrate: `docker compose exec backend sh -c "python manage.py migrate"`

### Loading Database Fixtures (i.e. sample data)


 ```
 docker compose exec backend sh -c "python manage.py loaddata sample_data/*.json"
 ```


### Linting, Formatting and Fixing Lint/Format Errors

1. Ensure `pre-commit` is available on PATH

   For python lovers: `pip install pre-commit`
   For homebrew (macOS): `brew install pre-commit`

1. Run `pre-commit run --all-files`

   On your first run some checks may fail with a note about the
   corrective measures the autofixer will execute, just run again to
   make sure all tests pass.

### Testing

- To run all tests: `docker compose exec backend sh -c "python
manage.py test"`
- To run all tests for `<some-app>`: `docker compose exec backend
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
