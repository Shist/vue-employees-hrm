// Wright errorsHandling method for the app using switch/case and call it in every request to Apollo
// use errorsHandling method in all services
// in App.vue call getUserById method to check authorization (if there is a token in Local Storage) and write userData to userStore
// in AppHeader component make v-for for userProfileMenu (open by click at Avatar icon)
// remove use ValidationErrors from composables to utils
// change the structure in graphql folder (make folders for user, department, project etc.)
// remove index.ts from pages to router folder. Call it pages.ts
// at UersPage and ProjectsPage make v-for for menu (update, delete) etc.
// in plugin folder make folder for toastifyConfig and index.ts file there
// think if we should change router.beforeEach hook
// get rid of checkAuthorization and checkTokenExpiration methods in authStore
// save token only to Local Storage and userData only to authStore
// delete extra methods from main.ts and remove it to App.vue
