export const PDF_DOC_STYLES = `
    .cv-preview {
      margin: 0 auto;
      padding: 32px 24px;
      max-width: 900px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .cv-preview__main-content-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      row-gap: 30px;
      color: #2e2e2e;
    }
    .cv-preview__title-and-btn-wrapper {
      display: flex;
      justify-content: space-between;
      column-gap: 50px;
    }
    .cv-preview__title-wrapper {
      display: flex;
      flex-direction: column;
      row-gap: 5px;
    }
    .cv-preview__title {
      font-family: "Roboto", Helvetica, Arial, sans-serif;
      font-size: 36px;
      line-height: 40px;
    }
    .cv-preview__position {
      font-family: "Roboto", Helvetica, Arial, sans-serif;
      font-size: 17px;
      line-height: 22px;
      text-transform: uppercase;
    }
    .cv-preview__export-pdf-btn {
      border: 1px solid var(--color-text-red);
      border-radius: 0;
    }
    .cv-preview__export-pdf-btn:disabled {
      filter: grayscale(50%);
    }
    .cv-preview__cv-main-info-wrapper {
      display: flex;
      column-gap: 30px;
    }
    .cv-preview__education-and-langauges-wrapper {
      padding-block: 15px;
      padding-right: 10px;
      min-width: 215px;
      display: flex;
      flex-direction: column;
      row-gap: 20px;
      border-right: 1px solid #c62f31;
    }
    .cv-preview__education-wrapper {
      display: flex;
      flex-direction: column;
      row-gap: 10px;
    }
    .cv-preview__education-headline {
      font-family: "Roboto", Helvetica, Arial, sans-serif;
      font-weight: 700;
      font-size: 16px;
      line-height: 20px;
    }
    .cv-preview__education-info {
      font-family: "Roboto", Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 20px;
    }
    .cv-preview__languages-section-wrapper {
      display: flex;
      flex-direction: column;
      row-gap: 10px;
    }
    .cv-preview__languages-headline {
      font-family: "Roboto", Helvetica, Arial, sans-serif;
      font-weight: 700;
      font-size: 16px;
      line-height: 20px;
    }
    .cv-preview__languages-wrapper {
      display: flex;
      flex-direction: column;
      row-gap: 5px;
    }
    .cv-preview__language-info {
      font-family: "Roboto", Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 20px;
    }
    .cv-preview__cv-description-and-skills-wrapper {
      padding-block: 15px;
      display: flex;
      flex-direction: column;
      row-gap: 20px;
    }
    .cv-preview__cv-description-wrapper {
      display: flex;
      flex-direction: column;
      row-gap: 10px;
    }
    .cv-preview__cv-description-headline {
      font-family: "Roboto", Helvetica, Arial, sans-serif;
      font-weight: 700;
      font-size: 16px;
      line-height: 22px;
    }
    .cv-preview__cv-description-info {
      font-family: "Roboto", Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 22px;
    }
    .cv-preview__skills-wrapper {
      display: flex;
      flex-direction: column;
      row-gap: 20px;
    }
    .cv-preview__skill-category {
      display: flex;
      flex-direction: column;
      row-gap: 10px;
    }
    .cv-preview__skill-category-headline {
      font-family: "Roboto", Helvetica, Arial, sans-serif;
      font-weight: 700;
      font-size: 16px;
      line-height: 22px;
    }
    .cv-preview__skill-category-skills {
      font-family: "Roboto", Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 22px;
    }
    .cv-preview__no-skills-label {
      font-family: "Roboto", Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 22px;
    }
  `;
