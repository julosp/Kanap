let products = localStorage.getItem("basket") 
console.log(products);

async function getProducts() {
  let url = "http://localhost:3000/api/products/" + itemInCart.id;
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
