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
INSERTION DU NAME DANS LE HTML*/
async function renderPrice() {
  let products = await getProducts();
  let container = document.getElementById("price");
  container.innerHTML = products.price;
}

/*RECUPERATION DU PRODUIT DEPUIS L'API
INSERTION DU NAME DANS LE HTML*/
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

async function renderAll(){
  renderPrice();
  renderName();
  renderImg();
  renderDescription();
  renderColor();
}
console.log(renderAll())

cartBtn = document.getElementById('addToCart')
cartBtn.addEventListener("click", addToCart)

async function addToCart() {
  //RECUP ID
  let product = await getProducts();
  let productId = product._id;
  //RECUP COLOR
  //CHECK IF COLOR IS VALID
  function checkColor(){
    let select = document.getElementById('colors');
    let colorValue = select.value
    if (colorValue === ""){
      //alert("Veuillez choissir une couleur")
      return false
    } else {
      return colorValue
    }
  }
 
  //RECUP QUANTITY
  //CHECK IF QUANTITY IS VALID
  function checkQuantity(){
    let quantityInput = document.getElementById('quantity')
    let quantity = quantityInput.value
    if (quantity === "0"){
      //alert("Veuillez ajouter un nombre d'article")
      return false
    } else if (quantity < "0"){
      //alert("Veuillez ajouter un nombre d'article valide")
      return false
    } else {
      return quantity
    }
  }


  class productInCart {
    constructor(id,color,quantity){
      this.id = id;
      this.color = color;
      this.quantity = quantity;
    }
    }
    let productArray = new productInCart(productId,checkColor(),checkQuantity())
    let areFalsy = Object.values(productArray).every(value => value);
    if (areFalsy === false){
      console.log("non")
      
      return false
    } else {
      window.localStorage.setItem("productArray",JSON.stringify(productArray))
      console.log(window.localStorage.productArray)
      console.log(productArray)
    }
  }
  console.log(localStorage.productArray)

  
  



