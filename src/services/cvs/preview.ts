import apolloClient from "@/plugins/apolloConfig";
import getCvPreviewDataByIdQuery from "@/graphql/cvs/preview/getCvPreviewDataById.query.gql";
import exportPDFQuery from "@/graphql/cvs/preview/exportPDF.mutation.gql";
import { checkCvId, getDetailedError } from "@/utils/handleErrors";
import {
  ICvPreviewServerData,
  IExportPDFInput,
} from "@/types/pages/cvs/preview";

export const getCvPreviewDataById = async (id: string) => {
  try {
    checkCvId(id);

    const response = (await apolloClient.query({
      query: getCvPreviewDataByIdQuery,
      variables: { cvId: Number(id) },
    })) as { data: { cv: ICvPreviewServerData } };

    return response.data.cv;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const exportPDF = async (exportPDFInput: IExportPDFInput) => {
  try {
    const response = (await apolloClient.query({
      query: exportPDFQuery,
      variables: { pdf: exportPDFInput },
    })) as { data: { exportPdf: string } };

    return response.data.exportPdf;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
