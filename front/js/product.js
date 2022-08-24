/*ISOLER L'ID DU PRODUIT*/ 
async function idByUrl() {
  var url = window.location.search;
  url = url.replace("?_id", "");
  return url;
}
/*FETCH L'API ET AJOUTER L'ID ISOLER*/ 
async function getProducts() {
  let id = await idByUrl();
  let url = "http://localhost:3000/api/products/" + id;
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
/*RECUPERATION DU PRODUIT DEPUIS L'API
CREATION IMG ET AJOUT D'ATTRIBUTS
INSERTION IMG DANS LE HTML*/
async function renderImg() {
  let products = await getProducts();
  let htmlSegment = document.createElement("img");
  let container = document.getElementById('item__img');
  htmlSegment.setAttribute("src",products.imageUrl)
  htmlSegment.setAttribute("alt",products.altTxt);
  container.appendChild(htmlSegment)
}

/*RECUPERATION DU PRODUIT DEPUIS L'API
INSERTION DU NAME DANS LE HTML*/
async function renderName() {
  let products = await getProducts();
  let container = document.getElementById('title');
  container.innerHTML = products.name
}

async function renderPrice() {
  let products = await getProducts();
  let container = document.getElementById('price');
  container.innerHTML = products.price
}









console.log(renderPrice())
console.log(renderName())
console.log(renderImg());
