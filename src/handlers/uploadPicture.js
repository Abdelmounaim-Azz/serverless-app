export async function uploadPicture() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: "true",
    }),
  };
}

export const handler = uploadPicture;
