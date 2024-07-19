import apolloClient from "@/plugins/apolloConfig";
import getUserProfileByIdQuery from "@/graphql/users/profile/getUserProfileById.query.gql";
import updateProfileQuery from "@/graphql/users/profile/updateProfile.mutation.gql";
import updateUserQuery from "@/graphql/users/updateUser.mutation.gql";
import uploadAvatarQuery from "@/graphql/users/profile/uploadAvatar.mutation.gql";
import deleteAvatarQuery from "@/graphql/users/profile/deleteAvatar.mutation.gql";
import { checkUserId, getDetailedError } from "@/utils/handleErrors";
import {
  IUserProfileServerData,
  IUploadAvatarInput,
  IUpdateUserInput,
  IUpdateProfileInput,
} from "@/types/pages/users/profile";

export const getUserProfileById = async (id: string) => {
  try {
    checkUserId(id);

    const response = (await apolloClient.query({
      query: getUserProfileByIdQuery,
      variables: { userId: Number(id) },
    })) as { data: { user: IUserProfileServerData } };

    return response.data.user;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const updateUserData = async (
  inputUserObj: Omit<IUpdateUserInput, "cvsIds" | "role">,
  inputProfileObj: IUpdateProfileInput
) => {
  try {
    await apolloClient.mutate({
      mutation: updateProfileQuery,
      variables: { profile: inputProfileObj },
    });

    const response = (await apolloClient.mutate({
      mutation: updateUserQuery,
      variables: { user: inputUserObj },
    })) as { data: { updateUser: IUserProfileServerData } };

    return response.data.updateUser;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const updateUserAvatar = async (inputAvatarObj: IUploadAvatarInput) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: uploadAvatarQuery,
      variables: { avatar: inputAvatarObj },
    })) as { data: { uploadAvatar: string } };

    return response.data.uploadAvatar;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const deleteUserAvatar = async (id: string) => {
  try {
    await apolloClient.mutate({
      mutation: deleteAvatarQuery,
      variables: { avatar: { userId: Number(id) } },
    });
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
