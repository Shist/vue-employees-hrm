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
          :disabled="isExportBtnDisabled"
        >
          Export PDF
        </v-btn>
      </div>
      <div class="cv-preview__cv-main-info-wrapper">
        <div class="cv-preview__education-and-langauges-wrapper">
          <div class="cv-preview__education-wrapper">
            <h3 class="cv-preview__education-headline">Education</h3>
            <span class="cv-preview__education-info">
              {{ empEducation }}
            </span>
          </div>
          <div class="cv-preview__languages-section-wrapper">
            <h3 class="cv-preview__languages-headline">Language proficiency</h3>
            <div class="cv-preview__languages-wrapper">
              <span
                v-for="language in empLanguages"
                :key="language.name"
                class="cv-preview__language-info"
              >
                {{ language.name }} — {{ language.proficiency }}
              </span>
              <span
                v-if="!empLanguages.length"
                class="cv-preview__language-info"
              >
                No any languages
              </span>
            </div>
          </div>
        </div>
        <div class="cv-preview__cv-description-and-skills-wrapper">
          <div class="cv-preview__cv-description-wrapper">
            <h3 class="cv-preview__cv-description-headline">{{ empCVName }}</h3>
            <p class="cv-preview__cv-description-info">
              {{ empCVDescription }}
            </p>
          </div>
          <div class="cv-preview__skills-wrapper">
            <div
              v-for="(aSkillNames, sCategory) in previewSkillCategoriesMap"
              :key="sCategory"
              class="cv-preview__skill-category"
            >
              <h3 class="cv-preview__skill-category-headline">
                {{ sCategory }}
              </h3>
              <span class="cv-preview__skill-category-skills">
                {{ aSkillNames.join(", ") }}
              </span>
            </div>
            <span v-if="!empSkills.length" class="cv-preview__no-skills-label">
              No any skills
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import html2pdf from "html2pdf.js";
import { useRoute } from "vue-router";
import useErrorState from "@/composables/useErrorState";
import { getCVPreviewDataByID } from "@/services/cvs/preview";
import { ICVPreviewLanguage, ICVPreviewSkill } from "@/types/cvPreviewUI";
import {
  IPreviewSkillCategoriesMap,
  ICategorySkillData,
} from "@/types/skillsUI";

const cvDocumentContent = ref<HTMLDivElement>();
const isExportBtnDisabled = ref(false);

const route = useRoute();

const cvID = computed<string>(() => {
  // eslint-disable-next-line
  const [section, cvID, tab] = route.fullPath.slice(1).split("/");
  return cvID;
});

const {
  isLoading,
  isError,
  errorMessage,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

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

const empLanguages = reactive<ICVPreviewLanguage[]>([]);

const empCVName = ref<string | null>(null);
const empCVDescription = ref<string | null>(null);

const empSkills = reactive<ICVPreviewSkill[]>([]);

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

onMounted(() => {
  fetchData();
});

watch(cvID, () => {
  fetchData();
});

function fetchData() {
  isLoading.value = true;

  getCVPreviewDataByID(cvID.value)
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

      empCVName.value = cvDetailsData.name;
      empCVDescription.value = cvDetailsData.description;

      empSkills.splice(0, empSkills.length, ...cvDetailsData.skills);

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

  const docExportBtn = iframeDoc.querySelector(".cv-preview__export-pdf-btn");
  if (docExportBtn && docExportBtn.nodeName === "BUTTON") {
    (docExportBtn as HTMLButtonElement).style.display = "none";
  }

  const docWrapper = iframeDoc.querySelector(
    ".cv-preview__main-content-wrapper"
  );
  if (docWrapper && docWrapper.nodeName === "DIV") {
    (docWrapper as HTMLDivElement).style.color = "var(--color-cv-doc-text)";
  }

  if (clonedContent instanceof HTMLElement) {
    const options = {
      margin: 1,
      filename: `${empCVName.value}.pdf`,
      jsPDF: { unit: "in" },
    };

    isExportBtnDisabled.value = true;

    await html2pdf().from(clonedContent).set(options).save();

    isExportBtnDisabled.value = false;
  }

  document.body.removeChild(iframe);
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
        &:disabled {
          filter: grayscale(50%);
        }
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
  }
}
</style>
