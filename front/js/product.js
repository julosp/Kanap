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
    alert("Erreur lors du chargement, veuillez réessayer");
  }
}
/*RECUPERATION DU PRODUIT DEPUIS L'API
CREATION IMG ET AJOUT D'ATTRIBUTS
INSERTION IMG DANS LE HTML*/
async function renderImg() {
  let products = await getProducts();
  let htmlSegment = document.createElement("img");
  let container = document.getElementById("item__img");
  htmlSegment.setAttribute("src", products.imageUrl);
  htmlSegment.setAttribute("alt", products.altTxt);
  container.appendChild(htmlSegment);
}

/*RECUPERATION DU PRODUIT DEPUIS L'API
INSERTION DU NAME DANS LE HTML*/
async function renderName() {
  let products = await getProducts();
  let container = document.getElementById("title");
  container.innerHTML = products.name;
}

/*RECUPERATION DU PRODUIT DEPUIS L'API
INSERTION DU NAME DANS LE TITLE DE LA BALISE HEAD*/
async function renderPageTitle() {
  let products = await getProducts();
  document.title = products.name;
}

/*RECUPERATION DU PRODUIT DEPUIS L'API
INSERTION DU PRIX DANS LE HTML*/
async function renderPrice() {
  let products = await getProducts();
  let container = document.getElementById("price");
  container.innerHTML = products.price;
}

/*RECUPERATION DU PRODUIT DEPUIS L'API
INSERTION DU DESCRIPTION DANS LE HTML*/
async function renderDescription() {
  let products = await getProducts();
  let container = document.getElementById("description");
  container.innerHTML = products.description;
}

/*RECUPERATION DU PRODUIT DEPUIS L'API
ARRAY COLOR DANS UN VARIABLE
LOOP DANS LES COULEURS
CREATION OPT + AJOUT TEXT ET VALUE*/
async function renderColor() {
  let products = await getProducts();
  let colorsArray = products.colors;
  let select = document.getElementById("colors");
  for (var i = 0; i < colorsArray.length; i++) {
    let option = colorsArray[i];
    let newOption = document.createElement("option");
    newOption.textContent = option;
    newOption.value = option;
    select.appendChild(newOption);
  }
}

async function renderAll() {
  renderPrice();
  renderName();
  renderImg();
  renderDescription();
  renderColor();
  renderPageTitle();
}
console.log(renderAll());

cartBtn = document.getElementById("addToCart");
cartBtn.addEventListener("click", addToCart);

async function addToCart() {
  //RECUP ID
  let product = await getProducts();
  let productId = product._id;
  //RECUP COLOR
  //CHECK IF COLOR IS VALID
  function checkColor() {
    let select = document.getElementById("colors");
    let colorValue = select.value;
    if (colorValue === "") {
      alert("Veuillez choissir une couleur");
      return false;
    } else {
      return colorValue;
    }
  }

  //RECUP QUANTITY
  //CHECK IF QUANTITY IS VALID
  function checkQuantity() {
    let quantityInput = document.getElementById("quantity");
    let quantity = quantityInput.value;
    if (quantity <= 0) {
      alert("Veuillez ajouter un nombre d'article valide. (Minimum = 1)");
      return false;
    } else if (quantity >= 101 ) {
      alert("Veuillez ajouter un nombre d'article valide. (Maximum = 100)");
      return false;
    } else {
      return quantity;
    }
  }

  //PATERN CREATION D'OBJETS PRODUCT
  class productInCart {
    constructor(id, color, quantity) {
      this.id = id;
      this.color = color;
      this.quantity = quantity;
    }
  }

  //CREATION OBJECT VIA LES INPUTS
  let productArray = new productInCart(
    productId,
    checkColor(),
    checkQuantity()
  );
  console.log(productArray);

  //SI INPUT RETOURN FALSE PAS D'AJOUT AU LOCALSTORAGE
  let areFalsy = Object.values(productArray).every((value) => value);
  if (areFalsy === false) {
    return false;
  }

  //SI INPUT VALIDE AJOUT AU LOCAL STORAGE
  function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
  }

  function getBasket() {
    //SI LOCALSTORAGE EST VIDE ON RETURN UNE ARRAY VIDE
    let basket = localStorage.getItem("basket");
    if (basket == null) {
      return [];
    } else {
      //SINON ON PARSE
      return JSON.parse(basket);
    }
  }

  function addBasket(product) {
    //ON RECUPERE LES PRODUIT DU LOCALSTORAGE
    let basket = getBasket();
    //ON VA CHERCHER LES ID DES PRODUITS
    let foundProduct = basket.find((p) => p.id == product.id);
    //ON VA CHERCHER LES COULEURS DES PRODUITS
    let foundColor = basket.find((p) => p.color == product.color);
    //SI l'ID ET LA COULEUR SON DEJA PRESENTE, ON AJOUTE A LA QUANTIEE
    if (foundProduct != undefined && foundColor != undefined) {
      var a = parseInt(foundProduct.quantity);
      var b = parseInt(quantity.value);
      console.log(a + b);
      foundProduct.quantity = a + b;
    } else {
      //SINON ON RECUPERE LA QUANTITEE ET ON PUSH DANS L'ARRAY DU LOCALSTORAGE
      product.quantity = checkQuantity();
      basket.push(product);
    }
    saveBasket(basket);
  }
  alert("Produit ajouté au panier");
  addBasket(productArray);
}
