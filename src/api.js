import axios from 'axios';
const key = '40894184-53d4e3919db169510b7307ae8';
const baseURL = `https://pixabay.com/api/`;

export const per_page = 40;

export function fatchImages(q, page) {
  const params = {
    key,
    q,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page,
  };
  return axios.get(baseURL, { params });
}
