<template>
  <div class="cv-preview">
    <AppSpinner v-if="isLoading" />
    <AppErrorSection v-else-if="isError" :errorMessage="errorMessage" />
    <div
      v-else
      ref="cvDocumentContent"
      class="cv-preview__main-content-wrapper"
    >
      <div class="cv-preview__title-and-btn-wrapper">
        <div class="cv-preview__title-wrapper">
          <h2 class="cv-preview__title">{{ cvTitle }}</h2>
          <span class="cv-preview__position">{{ empPosition }}</span>
        </div>
        <v-btn
          color="var(--color-wrapper-bg)"
          elevation="0"
          class="cv-preview__export-pdf-btn text-red-darken-4"
          @click="handleExportPDF"
          :loading="isExportBtnBusy"
        >
          Export PDF
        </v-btn>
      </div>
      <div class="cv-preview__cv-main-info-wrapper">
        <div class="cv-preview__education-and-langauges-wrapper">
          <div class="cv-preview__education-wrapper">
            <h4 class="cv-preview__education-headline">Education</h4>
            <span class="cv-preview__education-info">
              {{ empEducation }}
            </span>
          </div>
          <div class="cv-preview__languages-section-wrapper">
            <h4 class="cv-preview__languages-headline">Language proficiency</h4>
            <ul class="cv-preview__languages-wrapper">
              <li
                v-for="language in empLanguages"
                :key="language.name"
                class="cv-preview__language-info"
              >
                {{ language.name }} — {{ language.proficiency }}
              </li>
              <li v-if="!empLanguages.length" class="cv-preview__language-info">
                No languages specified
              </li>
            </ul>
          </div>
        </div>
        <div class="cv-preview__cv-description-and-skills-wrapper">
          <div class="cv-preview__cv-description-wrapper">
            <h4 class="cv-preview__cv-description-headline">
              {{ empCvName }}
            </h4>
            <p class="cv-preview__cv-description-info">
              {{ empCvDescription }}
            </p>
          </div>
          <ul class="cv-preview__skills-wrapper">
            <li
              v-for="(aSkillNames, sCategory) in previewSkillCategoriesMap"
              :key="sCategory"
              class="cv-preview__skill-category"
            >
              <h4 class="cv-preview__skill-category-headline">
                {{ sCategory }}
              </h4>
              <span class="cv-preview__skill-category-skills">
                {{ aSkillNames.join(", ") }}
              </span>
            </li>
            <li v-if="!empSkills.length" class="cv-preview__no-skills-label">
              No skills specified
            </li>
          </ul>
        </div>
      </div>
      <div class="cv-preview__emp-projects-wrapper">
        <h2 class="cv-preview__projects-headline">Projects</h2>
        <ul class="cv-preview__projects-list-wrapper">
          <li
            v-for="project in empProjects"
            :key="project.name"
            class="cv-preview__project-info-wrapper"
          >
            <div class="cv-preview__project-name-wrapper">
              <h3 class="cv-preview__project-name-headline">
                {{ project.name }}
              </h3>
            </div>
            <div class="cv-preview__project-info-sections-wrapper">
              <div class="cv-preview__project-info-section-wrapper">
                <h4 class="cv-preview__project-info-section-title">
                  Project roles
                </h4>
                <span
                  v-if="project.roles.length"
                  class="cv-preview__project-info-section-label"
                >
                  {{ project.roles.join(", ") }}
                </span>
                <span v-else class="cv-preview__project-info-section-label">
                  No roles specified for this project
                </span>
              </div>
              <div class="cv-preview__project-info-section-wrapper">
                <h4 class="cv-preview__project-info-section-title">
                  Responsibilities & achievements
                </h4>
                <span
                  v-if="project.responsibilities.length"
                  class="cv-preview__project-info-section-label"
                >
                  {{ project.responsibilities.join(", ") }}
                </span>
                <span v-else class="cv-preview__project-info-section-label">
                  No responsibilities or achievements specified for this project
                </span>
              </div>
              <div class="cv-preview__project-info-section-wrapper">
                <h4 class="cv-preview__project-info-section-title">Period</h4>
                <span class="cv-preview__project-info-section-label">
                  {{ new Date(project.start_date).toLocaleDateString() }} —
                  {{
                    project.end_date
                      ? new Date(project.end_date).toLocaleDateString()
                      : "Till now"
                  }}
                </span>
              </div>
            </div>
          </li>
          <li v-if="!empProjects.length" class="cv-preview__no-projects-label">
            No projects specified
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import useToast from "@/composables/useToast";
import useErrorState from "@/composables/useErrorState";
import { getCvPreviewDataById, exportPDF } from "@/services/cvs/preview";
import { PDF_DOC_STYLES } from "@/constants/pdfDocStyles";
import {
  ICvPreviewLanguage,
  ICvPreviewSkill,
  ICvPreviewProject,
  IExportPDFInput,
} from "@/types/cvPreviewUI";
import {
  IPreviewSkillCategoriesMap,
  ICategorySkillData,
} from "@/types/skillsUI";

const cvDocumentContent = ref<HTMLDivElement>();
const isExportBtnBusy = ref(false);

const route = useRoute();

const cvId = computed<string>(() => {
  // eslint-disable-next-line
  const [section, cvId, tab] = route.fullPath.slice(1).split("/");
  return cvId;
});

const {
  isLoading,
  isError,
  errorMessage,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

const { setErrorToast } = useToast();

const empFullName = ref<string | null>(null);
const empFirstName = ref<string | null>(null);
const empLastName = ref<string | null>(null);
const empEmail = ref<string | null>(null);

const cvTitle = computed(() => {
  if (empFullName.value) return empFullName.value;
  if (empFirstName.value) return empFirstName.value;
  if (empLastName.value) return empLastName.value;
  return empEmail.value;
});

const empPosition = ref("Position is not specified");

const empEducation = ref("Education is not specified");

const empLanguages = reactive<ICvPreviewLanguage[]>([]);

const empCvName = ref<string | null>(null);
const empCvDescription = ref<string | null>(null);

const empSkills = reactive<ICvPreviewSkill[]>([]);

const previewSkillCategoriesMap = computed(() => {
  if (!empSkills.length) return null;

  const resultObj: IPreviewSkillCategoriesMap = {};

  empSkills.forEach((skill, index) => {
    const category = skill.category;

    const oCategorySkill: ICategorySkillData = {
      name: skill.name,
      mastery: skill.mastery,
      skillIndex: index,
    };

    if (category) {
      if (resultObj[category]) {
        resultObj[category].push(oCategorySkill.name);
      } else {
        resultObj[category] = [oCategorySkill.name];
      }
    } else {
      if (resultObj["Other skills"]) {
        resultObj["Other skills"].push(oCategorySkill.name);
      } else {
        resultObj["Other skills"] = [oCategorySkill.name];
      }
    }
  });

  return resultObj;
});

const empProjects = reactive<ICvPreviewProject[]>([]);

onMounted(() => {
  fetchData();
});

watch(cvId, () => {
  fetchData();
});

function fetchData() {
  isLoading.value = true;

  getCvPreviewDataById(cvId.value)
    .then((cvDetailsData) => {
      if (!cvDetailsData) return;

      if (cvDetailsData.user) {
        empFullName.value = cvDetailsData.user.profile.full_name;
        empFirstName.value = cvDetailsData.user.profile.first_name;
        empLastName.value = cvDetailsData.user.profile.last_name;
        empEmail.value = cvDetailsData.user.email;

        if (cvDetailsData.user.position_name) {
          empPosition.value = cvDetailsData.user.position_name;
        }
      }

      if (cvDetailsData.education) {
        empEducation.value = cvDetailsData.education;
      }

      empLanguages.splice(0, empLanguages.length, ...cvDetailsData.languages);

      empCvName.value = cvDetailsData.name;
      empCvDescription.value = cvDetailsData.description;

      empSkills.splice(0, empSkills.length, ...cvDetailsData.skills);

      empProjects.splice(0, empProjects.length, ...cvDetailsData.projects);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

async function handleExportPDF() {
  if (!cvDocumentContent.value) return;

  const clonedContent = cvDocumentContent.value.cloneNode(true);

  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

  if (!iframeDoc) return;

  iframeDoc.open();
  iframeDoc.write("<html><head></head><body></body></html>");
  iframeDoc.close();

  iframeDoc.body.appendChild(clonedContent);

  const docFontLink = iframeDoc.createElement("link");
  docFontLink.rel = "stylesheet";
  docFontLink.href =
    "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
  iframeDoc.head.appendChild(docFontLink);

  const docStyleElement = iframeDoc.createElement("style");
  docStyleElement.textContent = PDF_DOC_STYLES;
  iframeDoc.head.appendChild(docStyleElement);

  const exportPDFInput: IExportPDFInput = {
    html: iframeDoc.documentElement.outerHTML,
    margin: {
      top: "15mm",
      bottom: "15mm",
      left: "12mm",
      right: "12mm",
    },
  };

  isExportBtnBusy.value = true;

  try {
    const base64 = await exportPDF(exportPDFInput);

    downloadPDF(base64);
  } catch (error: unknown) {
    if (error instanceof Error) {
      setErrorToast(error.message);
    }
  } finally {
    isExportBtnBusy.value = false;
  }

  document.body.removeChild(iframe);
}

function downloadPDF(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: "application/pdf" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = empCvName.value ?? "CV";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
</script>

<style lang="scss" scoped>
.cv-preview {
  margin: 0 auto;
  padding: 32px 24px;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__main-content-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 30px;
    color: var(--color-text);
    .cv-preview__title-and-btn-wrapper {
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
    .cv-preview__cv-main-info-wrapper {
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
          .cv-preview__no-skills-label {
            @include default-text(16px, 22px);
          }
        }
      }
    }
    .cv-preview__emp-projects-wrapper {
      display: flex;
      flex-direction: column;
      row-gap: 25px;
      .cv-preview__projects-headline {
        @include default-text(34px, 38px);
      }
      .cv-preview__projects-list-wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        .cv-preview__project-info-wrapper {
          display: flex;
          column-gap: 30px;
          .cv-preview__project-name-wrapper {
            padding-block: 15px;
            padding-right: 10px;
            min-width: 300px;
            border-right: 1px solid var(--color-text-red);
            .cv-preview__project-name-headline {
              @include default-headline(16px, 20px);
              color: var(--color-text-red);
              text-transform: uppercase;
            }
          }
          .cv-preview__project-info-sections-wrapper {
            padding-block: 15px;
            display: flex;
            flex-direction: column;
            row-gap: 20px;
            .cv-preview__project-info-section-wrapper {
              display: flex;
              flex-direction: column;
              row-gap: 10px;
              .cv-preview__project-info-section-title {
                @include default-headline(16px, 22px);
              }
              .cv-preview__project-info-section-label {
                @include default-text(16px, 22px);
              }
              .cv-preview__no-projects-label {
                @include default-text(16px, 22px);
              }
            }
          }
        }
      }
    }
  }
}
</style>
