async function getProducts() {
  let url = "http://localhost:3000/api/products";
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
    alert("Erreur lors du chargement, veuillez réessayer")
  }
}

async function renderProducts() {
  let products = await getProducts();
  let newHtml = "";
  products.forEach((product) => {
    let htmlSegment = ` <a href="./product.html?_id${product._id}">
                            <article>
                            <img src="${product.imageUrl}" alt="${product.altTxt}" >
                            <h3 class="productName">${product.name}</h3>
                            <p class="productDescription">${product.description}</p>
                            </article>
                            </a>
                            `;

    newHtml += htmlSegment;
  });

  let container = document.getElementById("items");
  container.innerHTML = newHtml;
}

renderProducts();

