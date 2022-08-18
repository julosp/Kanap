


async function getProducts() {
  let api = await fetch ("http://localhost:3000/api/products");
  let products = await api.json();
  console.log(products)
}

async function idByUrl() {
    let url = location.href;
    let id = url.substring(url.lastIndexOf("id") + 2);
    console.log(id)
  }

  console.log(getProducts())