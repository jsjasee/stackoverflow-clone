import {
  Permission,
  Role,
  IndexType,
  OrderBy,
  Compression,
} from "node-appwrite";

import { db, questionAttachmentBucket } from "../name";
import { tablesDB, storage } from "./config";

// a table is known as a collection in appwrite now. its the newer code.
export default async function getOrCreateStorage() {
  try {
    await storage.getBucket({
      bucketId: questionAttachmentBucket,
    });
    console.log("Storage Connected.");
  } catch (error) {
    // if there is no existing bucket, create one
    try {
      await storage.createBucket({
        bucketId: questionAttachmentBucket,
        name: questionAttachmentBucket,
        permissions: [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.read(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ], // optional
        fileSecurity: false, // optional - for optional fields, you can just omit it instead of indicating the value as 'undefined'
        allowedFileExtensions: ["jpg", "png", "gif", "jpeg", "webp", "heic"], // optional
      });
    } catch (error) {
      console.error("Error creating storage", error);
    }
  }
}
