export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    const apiURL = `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`;
    const res = await fetch(apiURL);
    const json = await res.json();
    if (!res.ok) throw new Error(`${json.message} ${res.status}`);

    const { recipe } = json.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    console.error(err);
  }
};
