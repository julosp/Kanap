//RECUPERATION DU LOCAL STORAGE
let productBasket = JSON.parse(localStorage.getItem("basket"));

//RECUPERATION DU LOCAL STORAGE
async function getBasket() {
  let basket = localStorage.getItem("basket");
  if (basket === null || basket == 0) {
    console.error();
  } else {
    return JSON.parse(basket);
  }
}

//FETCH DE L'API EN FONCTION DE L'ID DES PRODUIT DANS LE LOCAL STORAGE
async function getProductById() {
  let result = [];
  let basket = await getBasket();
  try {
    for (let productBasket of basket) {
      let response = await fetch(
        `http://localhost:3000/api/products/${productBasket.id}`
      );
      result.push(await response.json());
    }
  } catch (err) {
    console.log(err);
    alert("Erreur lors du chargement, veuillez réessayer");
  }

  //AJOUT DE LA COULEUR CHOISI AU PRODUIT FETCH
  let newColor = (result, basket) =>
    result.map((obj, i) => ({
      ...obj,
      colorSelected: basket[i].color,
    }));
  result = newColor(result, basket);

  //AJOUT DE LA QUANTITER CHOISI AU PRODUIT FETCH
  let quantity = (result, basket) =>
    result.map((obj, k) => ({
      ...obj,
      quantity: basket[k].quantity,
    }));
  result = quantity(result, basket);
  return result;
}

//CREATION DU HTML POUR CHAQUE PRODUIT DANS LE PANIER
async function newHtml() {
  let product = await getProductById();
  let newHtml = "";
  product.forEach((product) => {
    let htmlSegment = ` <article class="cart__item" data-id="${product._id}" data-color="${product.colors}">
                          <div class="cart__item__img">
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                          </div>
                          <div class="cart__item__content">
                            <div class="cart__item__content__description">
                              <h2>${product.name}</h2>
                              <p>${product.colorSelected}</p>
                              <p>${product.price}€</p>
                            </div>
                            <div class="cart__item__content__settings">
                              <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                              </div>
                              <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                              </div>
                            </div>
                          </div>
                        </article>
                            `;

    newHtml += htmlSegment;
  });
  let container = document.getElementById("cart__items");
  container.innerHTML = newHtml;
}
newHtml();

//MODIFICATION DES QUANTITER
async function modifyQuantity() {
  //recuperation des produits
  let product = await getProductById();
  //recuperer l'input de quantité
  let itemQuantity = document.querySelectorAll(".itemQuantity");
  //loop dans les inputs
  for (let i = 0; i < itemQuantity.length; i++) {
    //event listener au changement de l'utilisateur
    itemQuantity[i].addEventListener("change", (event) => {
      event.preventDefault();
      //nouvelle quantité selon l'input
      let newQuantity = itemQuantity[i].value;
      //remplacer quantité existante par nouvelle quantité
      product[i].quantity = newQuantity;
      productBasket[i].quantity = newQuantity;
      //si l'input est 0
      if (productBasket[i].quantity === "0") {
        //on va chercher l'id et la couleur
        let deleteId = productBasket[i].id;
        let deleteColor = productBasket[i].color;
        //on filtre pour supprimer si l'id et la couleur sont les memes
        productBasket = productBasket.filter(
          (element) => element.id !== deleteId || element.color !== deleteColor
        );
        //on enregistre le nouveau basket
        localStorage.setItem("basket", JSON.stringify(productBasket));
        // on reload la page
        window.location.href = "cart.html";
      } else if (
        //si la quantité est inférieur a 0 ou superieur a 100
        productBasket[i].quantity < 0 ||
        productBasket[i].quantity > 100
      ) {
        //message d'erreur pour l'utilisateur
        alert(
          "Quantité entrée invalide. Veuillez entrer une quantité entre 1 et 100."
        );
      } else {
        //sinon on save la nouvelle quantité de l'input dans le localstorage
        localStorage.setItem("basket", JSON.stringify(productBasket));
        //on reload la page
        window.location.href = "cart.html";
      }
    });
  }
}
modifyQuantity();

async function deleteProduct() {
  //recuperation des produits
  let product = await getProductById();
  //on recupere le btn delete
  let deleteBtn = document.querySelectorAll(".deleteItem");
  //on loop a travers tt les btn delete
  for (let i = 0; i < deleteBtn.length; i++) {
    //event listener click
    deleteBtn[i].addEventListener("click", (event) => {
      event.preventDefault();
      //on recupere l'id et la couleur
      let deleteId = productBasket[i].id;
      let deleteColor = productBasket[i].color;
      //on filtre pour supprimer si l'id et la couleur sont les memes
      productBasket = productBasket.filter(
        (element) => element.id !== deleteId || element.color !== deleteColor
      );
      //on save et reload
      localStorage.setItem("basket", JSON.stringify(productBasket));
      window.location.href = "cart.html";
    });
  }
}
deleteProduct();

let totalPrice = [];
let totalQuantity = [];

async function calculatePrice() {
  //on recupere le produits
  let product = await getProductById();
  //on loop a travers tout les produits
  for (let i = 0; i < product.length; i++) {
    //on recup le prix et la quantité
    let price = product[i].price;
    let quantity = product[i].quantity;
    // le prix x la quantité
    let total = price * quantity;
    //on push dans l'array totalprice
    totalPrice.push(total);
    // on additionne les prix dans l'array
    var priceTotal = totalPrice.reduce(function (a, b) {
      return a + b;
    }, 0);
  }
  let htmlPrice = document.getElementById("totalPrice");
  htmlPrice.textContent = priceTotal;
}
calculatePrice();

async function calculateQuantity() {
  //recup des produits
  let product = await getProductById();
  //loop a travers les produits
  for (let i = 0; i < product.length; i++) {
    //recup des quantités
    let quantity = product[i].quantity;
    //push des quantités dans l'array
    totalQuantity.push(quantity);
    //addition des quantités
    var quantityTotal = totalQuantity.reduce(function (a, b) {
      return +a + +b;
    }, 0);
  }
  let htmlArticle = document.getElementById("totalQuantity");
  htmlArticle.textContent = quantityTotal;
}

calculateQuantity();

function sendForm() {
  //recup du btn order et ajout d'un event listener
  let orderBtn = document.getElementById("order");
  orderBtn.addEventListener("click", (event) => {
    event.preventDefault();
    //recup des inputs de l'utilisateur
    let contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    };

    //verifications des inputs
    function checkFirstName() {
      let firstName = contact.firstName;
      if (/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,20}$/.test(firstName)) {
        return true;
      } else {
        let errorMsg = document.getElementById("firstNameErrorMsg");
        errorMsg.innerText = "Prénom invalide. Exemple : Karim / Jean-François";
        return false;
      }
    }

    function checkLastName() {
      let lastName = contact.lastName;
      if (/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,20}$/.test(lastName)) {
        return true;
      } else {
        let errorMsg = document.getElementById("lastNameErrorMsg");
        errorMsg.innerText =
          "Nom invalide. Exemple : Dupont / Jean-Dupont / Dupont Jean";
        return false;
      }
    }

    function checkAddress() {
      let address = contact.address;
      if (/^[^_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,20}$/.test(address)) {
        return true;
      } else {
        let errorMsg = document.getElementById("addressErrorMsg");
        errorMsg.innerText =
          "Addresse invalide. Exemple : 1 avenue des Champs Elysée";
        return false;
      }
    }

    function checkCity() {
      let city = contact.city;
      if (/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,20}$/.test(city)) {
        return true;
      } else {
        let errorMsg = document.getElementById("cityErrorMsg");
        errorMsg.innerText = "Ville invalide. Exemple : Paris";
        return false;
      }
    }

    function checkEmail() {
      let email = contact.email;
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return true;
      } else {
        let errorMsg = document.getElementById("emailErrorMsg");
        errorMsg.innerText = "Email invalide. Exemple : jean.dupont@hotmail.fr";
        return false;
      }
    }

    function checkValidity() {
      //si tout les inputs return true on save contact au local storage
      if (
        checkFirstName() &&
        checkLastName() &&
        checkAddress() &&
        checkCity() &&
        checkEmail()
      ) {
        localStorage.setItem("contact", JSON.stringify(contact));
        return true;
      } else {
        alert("Formulaire invalide. Veuillez vérifer vos informations.");
        return false;
      }
    }
    checkValidity();

    //si le contact est valide on recupere l'id des produits
    if (checkValidity() === true) {
      let products = [];
      function getId() {
        //on loop a travers les produits et push l'id dans l'array
        for (let p = 0; p < productBasket.length; p++) {
          products.push(productBasket[p].id);
        }
      }
      getId();

      //on crée un var avec le contact et les produits
      let cmdData = {
        contact,
        products,
      };

      //method post avec le contact et les produits
      let option = {
        method: "POST",
        body: JSON.stringify(cmdData),
        headers: {
          "Content-Type": "application/json",
        },
      };
      //on fetch l'api pour envoyer la method post
      fetch("http://localhost:3000/api/products/order", option)
        .then((response) => response.json())
        .then((data) => {
          //on fois la reponse obtenu, id de commande, on l'enregistre au local storage
          localStorage.setItem("orderId", data.orderId);
          //on redirige vers la page de comfirmation
          document.location.href = "confirmation.html?id=" + data.orderId;
        });
    } else {
      console.log("error");
    }
  });
}
sendForm();
