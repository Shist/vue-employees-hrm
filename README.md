# Vue Employees HRM

### This is Vue application (HRM), where users can see information about other users, their projects and CVs.

---

### This project was inspired by recommendations from this [technical assignment](https://curriculum-vitae-project.notion.site/b5c2402e649a44629178f52a8679eff9?v=66b53609862b4aeaa1134e4c6d74af6c).

---

### This project is hosted using the Vecel.com platform, you can see how it works here:

## https://vue-employees-hrm.vercel.app/

---

## Video demo:

https://github.com/user-attachments/assets/f226c0b5-0f4f-4b90-afd4-794b641b1901

---

## Instruction for launching this project

1. Go to the folder on your PC where you want to install the project:
   `cd "your-folder"`
1. Download and install files of this project:
   `git clone https://github.com/Shist/vue-employees-hrm`
1. Go to the app folder:
   `vue-employees-hrm`
1. Install all needed dependencies:
   `npm install`
1. Next, you need to set the necessary variables in the .env file of the project (a template for this file is in the repository). You will need to insert your GraphQL URL.
1. Once you've finished setting up the environment variable (see above), you can run the project:
   `npm run serve`

Here is exemplary view of your .env file:

- `# VUE_APP_GRAPHQL_URL= your GraphQL URL`
- `# VUE_APP_DEFAULT_LOCALE=en`
- `# VUE_APP_FALLBACK_LOCALE=en`
- `# VUE_APP_SUPPORTED_LOCALES=en,de,ru`

---

## Description of folder structure

- The `public` folder stores main html document and its favicon
- The `src` folder stores all the files connected with development
  - The `assets` folder stores all fonts and icons
    - The `fonts` folder stores all local fonts
    - The `styles` folder stores all the application styles
  - The `components` folder stores some Vue components that can presumably be reused somewhere many times
    - The `cv` folder stores all the components which relate to CVs pages
      - The `projects` folder stores all the components which relate to "CV Projects" page
      - The `skils` folder stores all the components which relate to "CV Skills" page
    - The `UI` folder stores some custom app elements which are expected to be used as default for the application
    - The `user` folder stores all the components which relate to Users pages
      - The `cvs` folder stores all the components which relate to "User CVs" page
      - The `languages` folder stores all the components which relate to "User Langauges" page
      - The `profile` folder stores all the components which relate to "User Profile" page
      - The `skills` folder stores all the components which relate to "User Skills" page
  - The `composables` folder stores composable functions (hooks) according to Composition API syntax
  - The `constants` folder stores all the constant variables of the app (which should not be changed anywhere else)
  - The `directives` folder stores logic for all custom directives of the app
  - The `graphql` folder stores templates for GraphQL queries and mutations
    - The `auth` folder stores templates for queries and mutations of authentication
    - The `cvs` folder stores templates for queries and mutations of CVs
      - The `details` folder stores templates for queries and mutations of CV details
      - The `preview` folder stores templates for queries and mutations of CV preview
      - The `projects` folder stores templates for queries and mutations of CV projects
      - The `skills` folder stores templates for queries and mutations of CV skills
    - The `departments` folder stores templates for queries and mutations of departments
    - The `languages` folder stores templates for queries and mutations of languages
    - The `positions` folder stores templates for queries and mutations of positions
    - The `projects` folder stores templates for queries and mutations of projects
    - The `skills` folder stores templates for queries and mutations of skills
    - The `users` folder stores templates for queries and mutations of users
      - The `cvs` folder stores templates for queries and mutations of user CVs
      - The `languages` folder stores templates for queries and mutations of user languages
      - The `profile` folder stores templates for queries and mutations of user profile
      - The `skills` folder stores templates for queries and mutations of user skills
  - The `pages` folder stores all Vue components which represent the main application pages
    - The `cvs` folder stores all Vue components which represent CV pages
    - The `users` folder stores all Vue components which represent user pages
  - The `plugins` folder stores settings and configurations for all the app plugins
    - The `i18n` folder stores settings and configurations for Vue I18n plugin
      - The `locales` folder stores \*.json files with translations for all app languages
    - The `vuetify` folder stores settings and configurations for Vuetify plugin
  - The `router` folder stores the files with settings of routing of the app
    - The `pages` folder stores map of the needed imports for router (which consists of all app pages)
  - The `services` folder stores files containing the logic of various service requests
    - The `cvs` folder stores files containing the logic of CVs service requests
    - The `users` folder stores files containing the logic of user service requests
  - The `store` folder stores state manager files (Pinia store modules)
  - The `types` folder stores all the interfaces and types of the whole app
    - The `pages` folder stores all the interfaces and types of all app pages
      - The `cvs` folder stores all the interfaces and types of all CVs pages
      - The `users` folder stores all the interfaces and types of all user pages
  - The `utils` folder stores all the utility functions for the app
- The `tests` folder stores all the tests for the app
  -The `unit` folder stores all the unit tests for the app

---

## Technologies used in the project

- HTML
- CSS / SCSS
- JavaScript
- TypeScript
- Vue3 (Composition API)
- Apollo GraphQL
- Pinia
- Vue Router
- Vuetify
- Vuelidate
- Vue Cookies
- Vue i18n
- vue3-toastify
- vue3-jest
- ESlint (with pre-commit hooks)
- Webpack / Babel (default from Vue)
- Prettier
- Fetch API (async/await)
- Modules (import/export)
- HTTP-Requests
