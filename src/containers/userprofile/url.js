
export const getSocialLinkurl = (url, baseUrl) => {
    let socialUrl = ""
    if (url) {
        if (url.indexOf("https://") > -1) {
            socialUrl = url
        }
        else if (url.indexOf("www") > -1) {
            socialUrl = `https://${url}`

        }
        else {
            socialUrl = `${baseUrl}${url}`
        }
    }
    return socialUrl
}

/**
 * @description This function is used to get the instagram username
 * @description and split the username at place of @ if username 
 * @description is started with @ otherwise return the username or url.
 * @param {} url
 * @returns {string}
 */
export const seperateInstagramUserName = (user) => {
    try {
    //split instagram username at position @
    let instagramUsername;
    if(user.instagram && user.instagram.startsWith('@')) {
        instagramUsername = user.instagram.split("@")[1];
    }else{
        instagramUsername = user.instagram;
    }
    return instagramUsername;
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
};