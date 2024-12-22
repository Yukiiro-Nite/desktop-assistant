export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Result = (reader.result as string).substring('data:image/png;base64,'.length)
      resolve(base64Result)
    }
    reader.readAsDataURL(blob)
  });
}

export const blobToArrayBuffer = (blob: Blob): Promise<ArrayBuffer> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const arrayBuffer = reader.result as ArrayBuffer
      resolve(arrayBuffer)
    }
    reader.readAsArrayBuffer(blob)
  })
}

export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Result = (reader.result as string)
      resolve(base64Result)
    }
    reader.readAsDataURL(file)
  });
}