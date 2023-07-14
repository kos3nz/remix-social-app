import { json } from 'remix';

export function convertToSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '') // not a word or a space
    .replace(/ +/g, '-');
}

export function validateField(
  title: string | null,
  value: string,
  length: number
) {
  if (typeof value !== 'string' || value.length < length) {
    return `${title} should be at least ${length} characters long`;
  }
}

export function truncate(text: string, num: number) {
  return text.length > num ? text.substring(0, num - 1) + '... ' : text;
}

export function pickRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

export function badRequest<T>(data: T) {
  return json(data, { status: 400 });
}
