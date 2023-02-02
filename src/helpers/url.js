export const isUrlWithoutProtocol = (url) =>{
 const result = url.search("https://")
  return result <=-1 ? true :false
}