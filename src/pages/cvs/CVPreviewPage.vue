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

    //await html2pdf().from(clonedContent).set(options).save();
    downloadPDF(
      "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Uj4+CmVuZG9iagoxNSAwIG9iago8PC9UeXBlIC9Gb250Ci9Gb250RGVzY3JpcHRvciAxNCAwIFIKL0Jhc2VGb250IC9CQUFBQUErVGltZXNOZXdSb21hblBTTVQKL1N1YnR5cGUgL0NJREZvbnRUeXBlMgovQ0lEVG9HSURNYXAgL0lkZW50aXR5Ci9DSURTeXN0ZW1JbmZvIDw8L1JlZ2lzdHJ5IChBZG9iZSkKL09yZGVyaW5nIChJZGVudGl0eSkKL1N1cHBsZW1lbnQgMD4+Ci9XIFswIFs3NzcuODMyMDNdIDMgMTcgMjUwIDM4IFs2NjYuOTkyMTldIDU0IFs1NTYuMTUyMzQgMCAwIDcyMi4xNjc5N10gNzAgWzQ0My44NDc2Nl0gNzIgWzQ0My44NDc2NiAzMzMuMDA3ODFdIDc2IFsyNzcuODMyMDMgMCAwIDAgNzc3LjgzMjAzXSA4NSBbMzMzLjAwNzgxIDM4OS4xNjAxNiAyNzcuODMyMDNdXQovRFcgNTAwPj4KZW5kb2JqCjE2IDAgb2JqCjw8L0ZpbHRlciAvRmxhdGVEZWNvZGUKL0xlbmd0aCAyODc+PiBzdHJlYW0KeJxdkd1qhDAQhe/zFHO5vVj8d1sQoXVb8KI/1O0DaDLaQI0hxgvfvnHibqEBle9kzkmcCar6XCtpIfgwE2/QQi+VMDhPi+EIHQ5SsSgGIbndid58bDULnLlZZ4tjrfqJFQVA8Ol2Z2tWODyKqcM7FrwbgUaqAQ5fVeO4WbT+wRGVhZCVJQjsXdJrq9/aESEg27EWbl/a9eg8fxWXVSPExJG/DZ8EzrrlaFo1ICtCt0ooXtwqGSrxbz/zrq7n362h6sRVh2EclhtFkadnojgnShOixFO204OnnE7Z89Jr+u0y6R7hq3PvTZ+8WHnxnsQsvMaTePZi5sUTfU7xfpiP3/5um8KtdXwxxnWNRkXt2holFd6mqSe9ubbnF+xzk9QKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUwCi9CYXNlRm9udCAvQkFBQUFBK1RpbWVzTmV3Um9tYW5QU01UCi9FbmNvZGluZyAvSWRlbnRpdHktSAovRGVzY2VuZGFudEZvbnRzIFsxNSAwIFJdCi9Ub1VuaWNvZGUgMTYgMCBSPj4KZW5kb2JqCnhyZWYKMCAxNwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDU5NyAwMDAwMCBuIAowMDAwMDAwMjYwIDAwMDAwIG4gCjAwMDAwMTMxMjcgMDAwMDAgbiAKMDAwMDAyODY2NCAwMDAwMCBuIAowMDAwMDAwMjk3IDAwMDAwIG4gCjAwMDAwMDA4MjQgMDAwMDAgbiAKMDAwMDAwMDg3OSAwMDAwMCBuIAowMDAwMDAwOTI2IDAwMDAwIG4gCjAwMDAwMTIxNjcgMDAwMDAgbiAKMDAwMDAxMjQyMiAwMDAwMCBuIAowMDAwMDEyNzc3IDAwMDAwIG4gCjAwMDAwMTMyODEgMDAwMDAgbiAKMDAwMDAyNzY2MCAwMDAwMCBuIAowMDAwMDI3OTExIDAwMDAwIG4gCjAwMDAwMjgzMDYgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDE3Ci9Sb290IDggMCBSCi9JbmZvIDEgMCBSPj4Kc3RhcnR4cmVmCjI4ODEzCiUlRU9GCg=="
    );

    isExportBtnDisabled.value = false;
  }

  document.body.removeChild(iframe);
}

function downloadPDF(base64String: string) {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: "application/pdf" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = empCVName.value ?? "CV";
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
