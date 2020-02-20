export default class Likes{

    constructor() {
        this.likes = [];
    }

     addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // Perist data in localStorage
         this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index,1);
        // Persist Data 
        this.persistData();
    }
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }
    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('Likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('Likes'));
        // Restore Likes from the localstorage
        if (storage) this.likes = storage;
    }

}