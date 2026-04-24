export async function compressImage(file: File): Promise<File> {
  const img = document.createElement("img");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const reader = new FileReader();

  return new Promise((resolve) => {
    reader.onload = (event) => {
      img.src = event.target?.result as string;

      img.onload = () => {
        const MAX_SIZE = 1024;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return;

            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
            });

            resolve(compressedFile);
          },
          "image/jpeg",
          0.7 // 🔥 quality (0.7 = good balance)
        );
      };
    };

    reader.readAsDataURL(file);
  });
}