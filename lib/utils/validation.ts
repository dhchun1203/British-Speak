/**
 * 이메일 형식 검증
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 파일 확장자 검증
 */
export function isValidImageFile(fileName: string, allowedExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif', 'webp']): boolean {
  const fileExt = fileName.split('.').pop()?.toLowerCase();
  return fileExt ? allowedExtensions.includes(fileExt) : false;
}

/**
 * 파일 크기 검증 (바이트 단위)
 */
export function isValidFileSize(fileSize: number, maxSizeInMB: number = 10): boolean {
  const maxSize = maxSizeInMB * 1024 * 1024; // MB를 바이트로 변환
  return fileSize <= maxSize;
}

/**
 * 필수 필드 검증
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter((field) => !data[field] || data[field].trim() === "");

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}






