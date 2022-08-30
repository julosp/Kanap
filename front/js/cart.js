let itemInCart = JSON.parse(localStorage.productArray)


async function getProducts() {
    let url = "http://localhost:3000/api/products/"+itemInCart.id;
    try {
      let res = await fetch(url);
      return await res.json();
    } catch (error) {
      console.log(error);
    }
}
async function newHtml(){
    let product = await getProducts();
    let htmlSegment = `<article class="cart__item" data-id="${product._id}" data-color="${itemInCart.color}">
                            <div class="cart__item__img">
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                            </div>
                            <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${product.name}</h2>
                                <p>${itemInCart.color}</p>
                                <p>${product.price}</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${itemInCart.quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                            </div>
                        </article>`;
    let container = document.getElementById("cart__items");
    container.innerHTML = htmlSegment;
}

newHtml()


