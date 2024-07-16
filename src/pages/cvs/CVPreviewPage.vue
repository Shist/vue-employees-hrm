<template>
  <div class="cv-preview">
    <div class="cv-preview__title-and-btn-wrapper">
      <div class="cv-preview__title-wrapper">
        <h2 class="cv-preview__title">Rostislav Harlanov</h2>
        <span class="cv-preview__position">Software Engineer</span>
      </div>
      <v-btn
        color="var(--color-wrapper-bg)"
        elevation="0"
        class="cv-preview__export-pdf-btn text-red-darken-4"
        @click="handleExportPDF"
      >
        Export PDF
      </v-btn>
    </div>
    <div class="cv-preview__cv-main-info-wrapper">
      <div class="cv-preview__education-and-langauges-wrapper">
        <div class="cv-preview__education-wrapper">
          <h3 class="cv-preview__education-headline">Education</h3>
          <span class="cv-preview__education-info">
            Engineer System Programmer
          </span>
        </div>
        <div class="cv-preview__languages-section-wrapper">
          <h3 class="cv-preview__languages-headline">Language proficiency</h3>
          <div class="cv-preview__languages-wrapper">
            <span class="cv-preview__language-info">English — B2</span>
            <span class="cv-preview__language-info">Russian — Native</span>
            <span class="cv-preview__language-info">Polish — A2</span>
          </div>
        </div>
      </div>
      <div class="cv-preview__cv-description-and-skills-wrapper">
        <div class="cv-preview__cv-description-wrapper">
          <h3 class="cv-preview__cv-description-headline">
            Front-end developer with 5+ years of experience
          </h3>
          <p class="cv-preview__cv-description-info">
            A software engineer with over 5 years of experience in coding. My
            top skills are TypeScript, React, HTML, CSS. I have worked in
            various industries like Business applications, E-commerce, dApp. In
            previous years my focus has been in the areas of WebGL and back-end
            development. Good knowledge of software development methodologies
            (Scrum, Waterfall, Kanban). Good team-working skills. Quick learner.
            Always ready to acquire new skills and gain new knowledge.
          </p>
        </div>
        <div class="cv-preview__skills-wrapper">
          <div class="cv-preview__skill-category">
            <h3 class="cv-preview__skill-category-headline">
              Programming languages
            </h3>
            <span class="cv-preview__skill-category-skills">
              JavaScript, TypeScript
            </span>
          </div>
          <div class="cv-preview__skill-category">
            <h3 class="cv-preview__skill-category-headline">
              Programming technologies
            </h3>
            <span class="cv-preview__skill-category-skills">
              Node.js, React, GraphQL, Three.js, Redux, MobX, NestJS
            </span>
          </div>
          <div class="cv-preview__skill-category">
            <h3 class="cv-preview__skill-category-headline">
              Database management system
            </h3>
            <span class="cv-preview__skill-category-skills">
              PostgreSQL, MongoDB
            </span>
          </div>
          <div class="cv-preview__skill-category">
            <h3 class="cv-preview__skill-category-headline">
              Source control systems
            </h3>
            <span class="cv-preview__skill-category-skills"> Git </span>
          </div>
          <div class="cv-preview__skill-category">
            <h3 class="cv-preview__skill-category-headline">Other skills</h3>
            <span class="cv-preview__skill-category-skills">
              HTML, CSS, SCSS
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
function handleExportPDF() {
  // TODO
}
</script>

<style lang="scss" scoped>
.cv-preview {
  margin: 0 auto;
  padding: 32px 24px;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  &__title-and-btn-wrapper {
    display: flex;
    justify-content: space-between;
    column-gap: 50px;
    .cv-preview__title-wrapper {
      display: flex;
      flex-direction: column;
      row-gap: 5px;
      .cv-preview__title {
        @include default-text(36px, 40px);
      }
      .cv-preview__position {
        @include default-text(17px, 22px);
        text-transform: uppercase;
      }
    }
    .cv-preview__export-pdf-btn {
      border: 1px solid var(--color-text-red);
      border-radius: 0;
    }
  }
  &__cv-main-info-wrapper {
    display: flex;
    column-gap: 30px;
    .cv-preview__education-and-langauges-wrapper {
      padding-block: 15px;
      padding-right: 10px;
      min-width: 215px;
      display: flex;
      flex-direction: column;
      row-gap: 20px;
      border-right: 1px solid var(--color-text-red);
      .cv-preview__education-wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        .cv-preview__education-headline {
          @include default-headline(16px, 20px);
        }
        .cv-preview__education-info {
          @include default-text(16px, 20px);
        }
      }
      .cv-preview__languages-section-wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        .cv-preview__languages-headline {
          @include default-headline(16px, 20px);
        }
        .cv-preview__languages-wrapper {
          display: flex;
          flex-direction: column;
          row-gap: 5px;
          .cv-preview__language-info {
            @include default-text(16px, 20px);
          }
        }
      }
    }
    .cv-preview__cv-description-and-skills-wrapper {
      padding-block: 15px;
      display: flex;
      flex-direction: column;
      row-gap: 20px;
      .cv-preview__cv-description-wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        .cv-preview__cv-description-headline {
          @include default-headline(16px, 22px);
        }
        .cv-preview__cv-description-info {
          @include default-text(16px, 22px);
        }
      }
      .cv-preview__skills-wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        .cv-preview__skill-category {
          display: flex;
          flex-direction: column;
          row-gap: 10px;
          .cv-preview__skill-category-headline {
            @include default-headline(16px, 22px);
          }
          .cv-preview__skill-category-skills {
            @include default-text(16px, 22px);
          }
        }
      }
    }
  }
}
</style>
