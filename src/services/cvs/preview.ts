import apolloClient from "@/plugins/apolloConfig";
import getCVPreviewDataByIDQuery from "@/graphql/cvs/preview/getCVPreviewDataByID.query.gql";
import exportPDFQuery from "@/graphql/cvs/preview/exportPDF.mutation.gql";
import { checkCvID, getDetailedError } from "@/utils/handleErrors";
import { ICVPreviewServerData } from "@/types/cvPreviewUI";
import { IExportPDFInput } from "@/types/backend-interfaces/cv/exportPDFInput";

export const getCVPreviewDataByID = async (id: string) => {
  try {
    checkCvID(id);

    const response = (await apolloClient.query({
      query: getCVPreviewDataByIDQuery,
      variables: { cvId: Number(id) },
    })) as { data: { cv: ICVPreviewServerData } };

    return response.data.cv;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const exportPDF = async (exportPDFInput: IExportPDFInput) => {
  try {
    console.log(exportPDFInput);
    const response = (await apolloClient.query({
      query: exportPDFQuery,
      variables: { pdf: exportPDFInput },
    })) as { data: { exportPdf: string } };

    console.log(response.data.exportPdf);

    return response.data.exportPdf;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
