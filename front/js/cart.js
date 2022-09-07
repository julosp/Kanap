let productBasket = JSON.parse(localStorage.getItem("basket"));

async function getBasket() {
  let basket = localStorage.getItem("basket");
  if (basket === null || basket == 0) {
    console.error();
  } else {
    return JSON.parse(basket);
  }
}



async function getProductById(){
  try {
    let basket = await getBasket();
    for (let productBasket of basket) {
      let response = await fetch(`http://localhost:3000/api/products/${productBasket.id}`)

      if (!response.ok){
        throw new Error(`Error! status ${response.status}`);
      }

      let result = await response.json()
      return result
    }
  } catch (err) {
    console.log(err)
  }
}




async function newHtml() {
  let product = await getProductById()
  let newHtml = "";
  let htmlSegment = ` <article class="cart__item" data-id="${product._id}" data-color="${product.colors}">
                          <div class="cart__item__img">
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                          </div>
                          <div class="cart__item__content">
                            <div class="cart__item__content__description">
                              <h2>${product.name}</h2>
                              <p>${product.color}</p>
                              <p>${product.price}€</p>
                            </div>
                            <div class="cart__item__content__settings">
                              <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                              </div>
                              <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                              </div>
                            </div>
                          </div>
                        </article>
                            `;

    newHtml += htmlSegment;

  let container = document.getElementById("cart__items");
  container.innerHTML = newHtml;
}

newHtml();