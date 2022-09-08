export async function getCategories() {
  const URL = 'https://api.mercadolibre.com/sites/MLB/categories';
  try {
    const res = await fetch(url);
    return res.json();
  } catch (error) {
    return error;
  }
}

export async function getProductsFromCategoryAndQuery(categoryId, query) {
  const URL = `https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}_ID&q=${query}`;
  try {
    const res = await fetch(url);
    return res.json();
  } catch (error) {
    return error;
  }
}

export async function getProductById() {
  // Esta implementação específica não é avaliada, mas pode ajudar você 🙂
  // Atenção: essa função não deverá ser chamada na tela do carrinho de compras.
}
