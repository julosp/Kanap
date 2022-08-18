async function idByUrl() {
  var url = window.location.search;
  url = url.replace("?_id", "");
  return url
}

async function getProducts() {
  let id = await idByUrl()
  let url = "http://localhost:3000/api/products/" + id;
  console.log(url)
  fetch(url)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    console.log(value);
  })
  .catch(function(err) {
  });
}

async function renderProduct(){
  let product = await getProducts();
  let newHtml = ''
}









console.log(renderProduct());