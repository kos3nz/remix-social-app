import { json } from 'remix';

export function convertToSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '') // not a word or a space
    .replace(/ +/g, '-');
}

export function validateField(title: string | null, length: number) {
  if (typeof title !== 'string' || title.length < length) {
    return `${title} should be at least ${length} characters long`;
  }
}

export function badRequest<T>(data: T) {
  return json(data, { status: 400 });
}
