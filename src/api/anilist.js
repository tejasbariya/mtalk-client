import axios from 'axios';

const ANILIST_API_URL = 'https://graphql.anilist.co';

export const fetchTrendingManhwa = async () => {
  const query = `
    query {
      Page(page: 1, perPage: 10) {
        media(type: MANGA, countryOfOrigin: "KR", sort: TRENDING_DESC) {
          id
          title { english romaji }
          coverImage { large extraLarge color }
          averageScore genres status
        }
      }
    }
  `;
  const response = await axios.post(ANILIST_API_URL, { query });
  return response.data.data.Page.media;
};

export const fetchPopularManhwa = async () => {
  const query = `
    query {
      Page(page: 1, perPage: 15) {
        media(type: MANGA, countryOfOrigin: "KR", sort: POPULARITY_DESC) {
          id
          title { english romaji }
          coverImage { large extraLarge }
          averageScore genres status
        }
      }
    }
  `;
  const response = await axios.post(ANILIST_API_URL, { query });
  return response.data.data.Page.media;
};

export const searchManhwa = async (searchTerm) => {
  if (!searchTerm) return [];
  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 20) {
        media(search: $search, type: MANGA, countryOfOrigin: "KR", sort: SEARCH_MATCH) {
          id
          title { english romaji }
          coverImage { large }
          averageScore genres status
        }
      }
    }
  `;
  const response = await axios.post(ANILIST_API_URL, { query, variables: { search: searchTerm } });
  return response.data.data.Page.media;
};

export const fetchTitleDetails = async (id) => {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: MANGA) {
        id
        title { english romaji native }
        coverImage { extraLarge large color }
        bannerImage
        description
        status
        chapters
        volumes
        averageScore
        genres
        staff { edges { node { name { full } } role } }
      }
    }
  `;
  const response = await axios.post(ANILIST_API_URL, { query, variables: { id } });
  return response.data.data.Media;
};
