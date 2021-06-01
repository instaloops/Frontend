export function loadCache<T>(key: string, df: any) {
  if (localStorage[key] === undefined) {
    return df as typeof df
  }
  return localStorage[key] as T
}
