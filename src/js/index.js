// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements,renderLoader,clearLoader} from './views/base';
import * as recipeView from './views/recipeView';
import Recipe from './models/Recipe';
import List from './models/List';
import * as listView from './views/listView';
import Likes from './models/Likes';
import * as likesView from './views/likesView';


// Global State of App
// **  Search Object
// **  Current recipe object
// **  Shopping List object
// **  Liked recipes

// class State 
const state = {};
// window.s = state;
// app initialize
state.initialize = true;
//** SEARCH CONTROLLER */
const controlSearch = async () => {
    // 1-Get Query from view -> getInput from the element
    const query = searchView.getInput(); // Food criteria
    
    // const query = 'pizza';
    //console.log(query);

    if (query) {
        // 2-New Search Object and add to state
        state.search = new Search(query);
        try {
            // 3- Prepare UI for results
            searchView.clearInput();
            searchView.clearResults();
            renderLoader(elements.searchRes);
            // 4- Search for Recipes
            await state.search.getResults();

            // 5-render results on UI
            clearLoader();
            searchView.renderResult(state.search.result);
        } catch (error) {
            console.log('Error in controlSearch: '+error)    
        }
    } 
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);//base 10
        searchView.clearResults();
        searchView.renderResult(state.search.result, goToPage);
        //console.log(goToPage);
        
    }
});

// **   RECIPE CONTROLLER
const controlRecipe = async () => {
    // Get id from url
    
    const id = window.location.hash.replace('#', '');
    // console.log('id: ' + id);
    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);
        // TESTING
        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            //console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();
            
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            // Render Recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
            console.log(state.recipe);
        } catch (error) {
            console.log("Error in Recipe: " + error)
        }
    
    } else {
        console.log('welcome');
        clearLoader();
        recipeView.renderWelcome();
    }
};


['hashchange', 'load'].forEach(event => window.addEventListener(event, () => {
    // console.log('on load');
    // if (window.location.hash.replace('#', '') == '' && state.initialize) {
    //     window.location.hash = '#47746';
    //     state.initialize = false; // Turn Off Initialization
    // };
    controlRecipe();
    
}));



const controlList = () => {
    // Create a new list If there is none yet
    if (!state.list) state.list = new List();
    // Add each ingredients to list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // console.log(state.list);
    // Handle the Delete 
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        //  Delete from UI
        listView.deleteItem(id);
    // Handle Count update
    } else if (e.target.closest('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
        // console.log(val)
    }
    // console.log(state.list);
});

// window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

// TESTING
// 

// TESTING
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });
// TESTING
// window.s = state;

/**  lIKE CONTROLLER */
const controlLike = () => {
    
    // If !Liked exist -> create new like for list
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    // User has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add Like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img_url);
        // toggle the like button
        likesView.toggleLikeBtn(true);
        // add like to the UI list
        likesView.renderLike(newLike);
       // console.log(state.recipe);
    // User has liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);
        // Toggle the like button
        likesView.toggleLikeBtn(false);
        // Remove like from UI list
        likesView.deleteLike(currentID);
        // console.log(state.likes);
    };
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}


// Restore Liked recipes on page loads
window.addEventListener('load', () => {
    state.likes = new Likes();
    // Restore Likes that were saved
    state.likes.readStorage();
    // Toggle Like menu button 
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    // Render the existing likes
    console.log(state.likes.likes);
    state.likes.likes.forEach(like => {
        likesView.renderLike(like)
    });
    
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    
    if (e.target.closest(".btn-dec") && (state.recipe.servings > 1)) {
        // Decrease button click
        state.recipe.updateServings('dec');
        recipeView.updateServingsIndegredients(state.recipe);
    } else if (e.target.closest(".btn-inc")) {
        // Increase Button click
        state.recipe.updateServings('inc');
        recipeView.updateServingsIndegredients(state.recipe);
    } else if (e.target.closest(".recipe__btn--add")) {
        // Add Ingredients to Shopping List
        controlList();
    } else if (e.target.closest(".recipe__love")) {
        // Like controller
        controlLike();
    }

});


// elements.incServings.addEventListener('click', e => {
//     console.log('Increase');
//     state.recipe.updateServings('inc');
// });