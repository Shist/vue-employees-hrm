<template>
  <div class="cv-preview">
    <AppSpinner v-if="isLoading" />
    <AppErrorSection v-else-if="isError" :errorMessageKey="errorMessageKey" />
    <div
      v-else
      ref="cvDocumentContent"
      class="cv-preview__main-content-wrapper"
    >
      <div class="cv-preview__title-and-btn-wrapper">
        <div class="cv-preview__title-wrapper">
          <h2 class="cv-preview__title">{{ cvTitle }}</h2>
          <span class="cv-preview__position">{{
            empPosition ?? $t("cvsPreviewPage.noPositionMsg")
          }}</span>
        </div>
        <v-btn
          color="var(--color-wrapper-bg)"
          elevation="0"
          class="cv-preview__export-pdf-btn text-red-darken-4"
          @click="handleExportPDF"
          :loading="isExportBtnBusy"
        >
          {{ $t("cvsPreviewPage.btnExport") }}
        </v-btn>
      </div>
      <div class="cv-preview__cv-main-info-wrapper">
        <div class="cv-preview__education-and-langauges-wrapper">
          <div class="cv-preview__education-wrapper">
            <h4 class="cv-preview__education-headline">
              {{ $t("cvsPreviewPage.education") }}
            </h4>
            <span class="cv-preview__education-info">
              {{ empEducation ?? t("cvsPreviewPage.noEducationMsg") }}
            </span>
          </div>
          <div class="cv-preview__languages-section-wrapper">
            <h4 class="cv-preview__languages-headline">
              {{ $t("cvsPreviewPage.languageProficiency") }}
            </h4>
            <ul class="cv-preview__languages-wrapper">
              <li
                v-for="language in empLanguages"
                :key="language.name"
                class="cv-preview__language-info"
              >
                {{ language.name }} —
                {{
                  $t(
                    `userLanguagesPage.languageProficiency.${language.proficiency}`
                  )
                }}
              </li>
              <li v-if="!empLanguages.length" class="cv-preview__language-info">
                {{ $t("cvsPreviewPage.noLanguagesMsg") }}
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
                {{ $t(`userSkillsPage.skillCategories.${sCategory}`) }}
              </h4>
              <span class="cv-preview__skill-category-skills">
                {{ aSkillNames.join(", ") }}
              </span>
            </li>
            <li v-if="!empSkills.length" class="cv-preview__no-skills-label">
              {{ $t("cvsPreviewPage.noSkillsMsg") }}
            </li>
          </ul>
        </div>
      </div>
      <div class="cv-preview__emp-projects-wrapper">
        <h2 class="cv-preview__projects-headline">
          {{ $t("cvsPreviewPage.projects") }}
        </h2>
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
                  {{ $t("cvsPreviewPage.projectRoles") }}
                </h4>
                <span
                  v-if="project.roles.length"
                  class="cv-preview__project-info-section-label"
                >
                  {{ project.roles.join(", ") }}
                </span>
                <span v-else class="cv-preview__project-info-section-label">
                  {{ $t("cvsPreviewPage.noProjectRolesMsg") }}
                </span>
              </div>
              <div class="cv-preview__project-info-section-wrapper">
                <h4 class="cv-preview__project-info-section-title">
                  {{ $t("cvsPreviewPage.responsibilitiesAndAchievements") }}
                </h4>
                <span
                  v-if="project.responsibilities.length"
                  class="cv-preview__project-info-section-label"
                >
                  {{ project.responsibilities.join(", ") }}
                </span>
                <span v-else class="cv-preview__project-info-section-label">
                  {{ $t("cvsPreviewPage.noResponsibilitiesAndAchievements") }}
                </span>
              </div>
              <div class="cv-preview__project-info-section-wrapper">
                <h4 class="cv-preview__project-info-section-title">
                  {{ $t("cvsPreviewPage.period") }}
                </h4>
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
            {{ $t("cvsPreviewPage.noProjectsMsg") }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import useToast from "@/composables/useToast";
import useErrorState from "@/composables/useErrorState";
import { getCvPreviewDataById, exportPDF } from "@/services/cvs/preview";
import { PDF_DOC_STYLES } from "@/constants/pdfDocStyles";
import {
  ICvPreviewLanguage,
  ICvPreviewSkill,
  ICvPreviewProject,
  IExportPDFInput,
  IPreviewSkillCategoriesMap,
} from "@/types/pages/cvs/preview";
import { ICategorySkillData } from "@/types/skillsStructures";

const { t } = useI18n({ useScope: "global" });

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
  errorMessageKey,
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

const empPosition = ref<null | string>(null);

const empEducation = ref<null | string>(null);

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
      setErrorToast(t(`errors.${error.message}`));
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
  @media (max-width: $tablet-l) {
    padding: 20px 10px;
  }
  &__main-content-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 30px;
    color: var(--color-text);
    @media (max-width: $tablet-l) {
      row-gap: 15px;
    }
    .cv-preview__title-and-btn-wrapper {
      display: flex;
      justify-content: space-between;
      column-gap: 50px;
      @media (max-width: $tablet-l) {
        column-gap: 25px;
      }
      @media (max-width: $phone-l) {
        column-gap: 10px;
      }
      .cv-preview__title-wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 5px;
        .cv-preview__title {
          @include default-text(36px, 40px);
          @media (max-width: $tablet-l) {
            font-size: 32px;
            line-height: 36px;
          }
          @media (max-width: $phone-l) {
            font-size: 28px;
            line-height: 32px;
          }
        }
        .cv-preview__position {
          @include default-text(17px, 22px);
          text-transform: uppercase;
          @media (max-width: $tablet-l) {
            font-size: 14px;
            line-height: 19px;
          }
          @media (max-width: $phone-l) {
            font-size: 12px;
            line-height: 17px;
          }
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
      @media (max-width: $tablet-l) {
        column-gap: 15px;
      }
      .cv-preview__education-and-langauges-wrapper {
        padding-block: 15px;
        padding-right: 10px;
        min-width: 215px;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        border-right: 1px solid var(--color-text-red);
        @media (max-width: $tablet-l) {
          row-gap: 10px;
          min-width: 120px;
          width: 120px;
        }
        .cv-preview__education-wrapper {
          display: flex;
          flex-direction: column;
          row-gap: 10px;
          .cv-preview__education-headline {
            @include default-headline(16px, 20px);
            @media (max-width: $tablet-l) {
              font-size: 14px;
              line-height: 18px;
            }
            @media (max-width: $phone-l) {
              font-size: 12px;
              line-height: 16px;
            }
          }
          .cv-preview__education-info {
            @include default-text(16px, 20px);
            @media (max-width: $tablet-l) {
              font-size: 14px;
              line-height: 18px;
            }
            @media (max-width: $phone-l) {
              font-size: 12px;
              line-height: 16px;
            }
          }
        }
        .cv-preview__languages-section-wrapper {
          display: flex;
          flex-direction: column;
          row-gap: 10px;
          @media (max-width: $tablet-l) {
            row-gap: 5px;
          }
          .cv-preview__languages-headline {
            @include default-headline(16px, 20px);
            @media (max-width: $tablet-l) {
              font-size: 14px;
              line-height: 18px;
            }
            @media (max-width: $phone-l) {
              font-size: 12px;
              line-height: 16px;
            }
          }
          .cv-preview__languages-wrapper {
            display: flex;
            flex-direction: column;
            row-gap: 5px;
            .cv-preview__language-info {
              @include default-text(16px, 20px);
              @media (max-width: $tablet-l) {
                font-size: 14px;
                line-height: 18px;
              }
              @media (max-width: $phone-l) {
                font-size: 12px;
                line-height: 16px;
              }
            }
          }
        }
      }
      .cv-preview__cv-description-and-skills-wrapper {
        padding-block: 15px;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        @media (max-width: $tablet-l) {
          row-gap: 10px;
        }
        .cv-preview__cv-description-wrapper {
          display: flex;
          flex-direction: column;
          row-gap: 10px;
          @media (max-width: $tablet-l) {
            row-gap: 5px;
          }
          .cv-preview__cv-description-headline {
            @include default-headline(16px, 22px);
            @media (max-width: $tablet-l) {
              font-size: 14px;
              line-height: 20px;
            }
            @media (max-width: $phone-l) {
              font-size: 12px;
              line-height: 18px;
            }
          }
          .cv-preview__cv-description-info {
            @include default-text(16px, 22px);
            @media (max-width: $tablet-l) {
              font-size: 14px;
              line-height: 20px;
            }
            @media (max-width: $phone-l) {
              font-size: 12px;
              line-height: 18px;
            }
          }
        }
        .cv-preview__skills-wrapper {
          display: flex;
          flex-direction: column;
          row-gap: 20px;
          @media (max-width: $tablet-l) {
            row-gap: 10px;
          }
          .cv-preview__skill-category {
            display: flex;
            flex-direction: column;
            row-gap: 10px;
            @media (max-width: $tablet-l) {
              row-gap: 5px;
            }
            .cv-preview__skill-category-headline {
              @include default-headline(16px, 22px);
              @media (max-width: $tablet-l) {
                font-size: 14px;
                line-height: 20px;
              }
              @media (max-width: $phone-l) {
                font-size: 12px;
                line-height: 18px;
              }
            }
            .cv-preview__skill-category-skills {
              @include default-text(16px, 22px);
              @media (max-width: $tablet-l) {
                font-size: 14px;
                line-height: 20px;
              }
              @media (max-width: $phone-l) {
                font-size: 12px;
                line-height: 18px;
              }
            }
          }
          .cv-preview__no-skills-label {
            @include default-text(16px, 22px);
            @media (max-width: $tablet-l) {
              font-size: 14px;
              line-height: 20px;
            }
            @media (max-width: $phone-l) {
              font-size: 12px;
              line-height: 18px;
            }
          }
        }
      }
    }
    .cv-preview__emp-projects-wrapper {
      display: flex;
      flex-direction: column;
      row-gap: 25px;
      @media (max-width: $tablet-l) {
        row-gap: 15px;
      }
      .cv-preview__projects-headline {
        @include default-text(34px, 38px);
        @media (max-width: $tablet-l) {
          font-size: 30px;
          line-height: 34px;
        }
        @media (max-width: $phone-l) {
          font-size: 26px;
          line-height: 30px;
        }
      }
      .cv-preview__projects-list-wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        .cv-preview__project-info-wrapper {
          display: flex;
          column-gap: 30px;
          @media (max-width: $tablet-l) {
            column-gap: 15px;
          }
          .cv-preview__project-name-wrapper {
            padding-block: 15px;
            padding-right: 10px;
            min-width: 300px;
            border-right: 1px solid var(--color-text-red);
            @media (max-width: $tablet-l) {
              min-width: 120px;
              width: 120px;
            }
            .cv-preview__project-name-headline {
              @include default-headline(16px, 20px);
              color: var(--color-text-red);
              text-transform: uppercase;
              @media (max-width: $tablet-l) {
                font-size: 14px;
                line-height: 20px;
              }
              @media (max-width: $phone-l) {
                font-size: 12px;
                line-height: 18px;
              }
            }
          }
          .cv-preview__project-info-sections-wrapper {
            padding-block: 15px;
            display: flex;
            flex-direction: column;
            row-gap: 20px;
            @media (max-width: $tablet-l) {
              row-gap: 10px;
            }
            .cv-preview__project-info-section-wrapper {
              display: flex;
              flex-direction: column;
              row-gap: 10px;
              @media (max-width: $tablet-l) {
                row-gap: 5px;
              }
              .cv-preview__project-info-section-title {
                @include default-headline(16px, 22px);
                @media (max-width: $tablet-l) {
                  font-size: 14px;
                  line-height: 20px;
                }
                @media (max-width: $phone-l) {
                  font-size: 12px;
                  line-height: 18px;
                }
              }
              .cv-preview__project-info-section-label {
                @include default-text(16px, 22px);
                @media (max-width: $tablet-l) {
                  font-size: 14px;
                  line-height: 20px;
                }
                @media (max-width: $phone-l) {
                  font-size: 12px;
                  line-height: 18px;
                }
              }
              .cv-preview__no-projects-label {
                @include default-text(16px, 22px);
                @media (max-width: $tablet-l) {
                  font-size: 14px;
                  line-height: 20px;
                }
                @media (max-width: $phone-l) {
                  font-size: 12px;
                  line-height: 18px;
                }
              }
            }
          }
        }
      }
    }
  }
}

:deep(.cv-preview__export-pdf-btn .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 10px;
  }
}
</style>
