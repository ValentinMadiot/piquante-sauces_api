export const environment = {
  production: false,
  apiUrl: '', // laisse vide pour utiliser le proxy : fetch(`${apiUrl}/api/...`) devient fetch('/api/...')
};
