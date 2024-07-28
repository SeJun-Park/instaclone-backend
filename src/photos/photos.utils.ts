export const createHashtagObjArray = (caption:string|undefined) => {

    let hashtagObjArray : any[] = [];
    // parse caption -- #이 붙은 단어들을 hashtag들로 추출하고 있음.
    if(caption) {

        const hashtags = caption.match(/#[\w]+/g);

        if(hashtags) {
            hashtagObjArray = hashtags.map((hashtag) => ({where:{hashtag:hashtag}, create:{hashtag:hashtag} }));
        }
        
    }
    return hashtagObjArray;

}