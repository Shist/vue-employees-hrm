import { NOT_FOUND_USER, NOT_FOUND_ERROR_NAME } from "@/constants/errorMessage";

export default function checkID(id: string) {
  if (!Number.isInteger(Number(id)) || BigInt(id) > 2147483647n) {
    const notFoundError = new Error(NOT_FOUND_USER);
    notFoundError.name = NOT_FOUND_ERROR_NAME;
    throw notFoundError;
  }
}
