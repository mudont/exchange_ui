const pathsMap = {
  home: () => process.env.REACT_APP_BASE_HREF + '/exchange',
  addArticle: () => process.env.REACT_APP_BASE_HREF + '/add-article',
  viewArticle: (articleId: string) => process.env.REACT_APP_BASE_HREF + `/articles/${articleId}`,
  editArticle: (articleId: string) => process.env.REACT_APP_BASE_HREF + `/articles/${articleId}/edit`,
  auth: () => process.env.REACT_APP_BASE_HREF + '/auth',
  auth_home: () => process.env.REACT_APP_BASE_HREF + '/home',
  callback: () => process.env.REACT_APP_BASE_HREF + '/callback',
  exchange: () => process.env.REACT_APP_BASE_HREF + '/',
};
type PathsMap = typeof pathsMap;

export const getPath = <TRoute extends keyof PathsMap>(
  route: TRoute,
  ...params: Parameters<PathsMap[TRoute]>
) => {
  const pathCb: (...args: any[]) => string = pathsMap[route];

  return pathCb(...params);
};
