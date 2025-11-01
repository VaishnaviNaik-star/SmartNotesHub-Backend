const uploadToUploadcare = async (file) => {
  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUBLIC_KEY);
  formData.append("UPLOADCARE_STORE", "1"); // ✅ auto-store permanently
  formData.append("file", file);

  const res = await fetch("https://upload.uploadcare.com/", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.file) throw new Error("File upload failed");

  return `https://ucarecdn.com/${data.file}/`; // ✅ permanent CDN URL
};
