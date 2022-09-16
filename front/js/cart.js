let productBasket = JSON.parse(localStorage.getItem("basket"));

async function getBasket() {
  let basket = localStorage.getItem("basket");
  if (basket === null || basket == 0) {
    console.error();
  } else {
    return JSON.parse(basket);
  }
}

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
  }

  let newColor = (result, basket) =>
    result.map((obj, i) => ({
      ...obj,
      colorSelected: basket[i].color,
    }));
  result = newColor(result, basket);

  let quantity = (result, basket) =>
    result.map((obj, k) => ({
      ...obj,
      quantity: basket[k].quantity,
    }));
  result = quantity(result, basket);
  return result;
}

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

async function modifyQuantity() {
  let product = await getProductById();
  let itemQuantity = document.querySelectorAll(".itemQuantity");
  for (let i = 0; i < itemQuantity.length; i++) {
    itemQuantity[i].addEventListener("change", (event) => {
      event.preventDefault();
      let newQuantity = itemQuantity[i].value;
      product[i].quantity = newQuantity;
      productBasket[i].quantity = newQuantity;
      localStorage.setItem("basket", JSON.stringify(productBasket));
      //window.location.href = "cart.html";
    });
  }
}
modifyQuantity();

async function deleteProduct() {
  let product = await getProductById();
  let deleteBtn = document.querySelectorAll(".deleteItem");
  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", (event) => {
      event.preventDefault();
      let deleteId = productBasket[i].id;
      let deleteColor = productBasket[i].color;
      productBasket = productBasket.filter(
        (element) => element.id !== deleteId || element.color !== deleteColor
      );
      localStorage.setItem("basket", JSON.stringify(productBasket));
      //window.location.href = "cart.html";
    });
  }
}
deleteProduct();

let totalPrice = [];
let totalQuantity = [];

async function calculatePrice() {
  let product = await getProductById();
  for (let i = 0; i < product.length; i++) {
    let price = product[i].price;
    let quantity = product[i].quantity;
    let total = price * quantity;
    totalPrice.push(total);
    var priceTotal = totalPrice.reduce(function (a, b) {
      return a + b;
    }, 0);
  }
  let htmlPrice = document.getElementById("totalPrice");
  htmlPrice.textContent = priceTotal;
}
calculatePrice();

async function calculateQuantity() {
  let product = await getProductById();
  for (let i = 0; i < product.length; i++) {
    let quantity = product[i].quantity;
    totalQuantity.push(quantity);
    var quantityTotal = totalQuantity.reduce(function (a, b) {
      return +a + +b;
    }, 0);
    console.log(quantityTotal);
  }
  let htmlArticle = document.getElementById("totalQuantity");
  htmlArticle.textContent = quantityTotal;
}

calculateQuantity();

function sendForm() {
  let orderBtn = document.getElementById("order");
  orderBtn.addEventListener("click", (event) => {
    event.preventDefault();

    let contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      adress: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    };
    console.log(contact);

    function checkFirstName() {
      let firstName = contact.firstName;
      if (/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,20}$/.test(firstName)) {
        return true;
      } else {
        let errorMsg = document.getElementById("firstNameErrorMsg");
        errorMsg.innerText = "Prénom invalide";
      }
    }

    function checkLastName() {
      let lastName = contact.lastName;
      if (/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,20}$/.test(lastName)) {
        return true;
      } else {
        let errorMsg = document.getElementById("lastNameErrorMsg");
        errorMsg.innerText = "Nom invalide";
      }
    }

    function checkAdress() {
      let address = contact.address;
      if (/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,20}$/.test(address)) {
        return true;
      } else {
        let errorMsg = document.getElementById("addressErrorMsg");
        errorMsg.innerText = "Adresse invalide";
      }
    }

    function checkCity() {
      let city = contact.city;
      if (/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,20}$/.test(city)) {
        return true;
      } else {
        let errorMsg = document.getElementById("cityErrorMsg");
        errorMsg.innerText = "Ville invalide";
      }
    }

    function checkEmail() {
      let email = contact.email;
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return true;
      } else {
        let errorMsg = document.getElementById("emailErrorMsg");
        errorMsg.innerText = "Email invalide";
      }
    }

    function checkValidity() {
      if (
        checkFirstName() &&
        checkLastName() &&
        checkAdress() &&
        checkCity() &&
        checkEmail()
      ) {
        localStorage.setItem("contact", JSON.stringify(contact));
        return true;
      } else {
        alert(
          "Formulaire invalide, veuillez verifier les informations entrées."
        );
      }
    }
    checkValidity();
  });
}
sendForm();
