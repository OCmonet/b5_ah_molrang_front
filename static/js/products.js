// Access Token 값 불러오기
const access_token = localStorage.getItem("access");
console.log(access_token)

// payload 값 가져오기 -> name, user_id 가능!
const payload = localStorage.getItem('payload');
const payload_parse = JSON.parse(payload);

// 로그인이 안되어 있을 때 user_id 에러 발생에서 if문 넣어주었습니다!
if (payload) {
    // 사용자의 ID 값을 추출하여 변수에 할당
    const user = JSON.parse(payload)['user_id'];
    const user_id = user;
}

console.log(payload_parse);

// API 객체 생성
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Authorization': `Bearer ${access_token}`
    }
});


function productDetail(id_product) {
    window.location.href = `${frontend_base_url}/templates/product-detail.html?id_product=${id_product}`
}


window.onload = async function localProducts() {
    try {
        const products = await getProducts();

        const product_list = document.getElementById("product-list");

        if (product_list) {
            products.forEach((product) => {
                const newCol = document.createElement("div");
                newCol.setAttribute("class", "col");

                const newCard = document.createElement("div");
                newCard.setAttribute("class", "card");
                newCard.setAttribute("id", product.id);
                newCard.addEventListener("click", () =>
                    productDetail(product.id)
                );

                newCol.append(newCard);

                const productImage = document.createElement("img");
                productImage.setAttribute("class", "card-img-top");

                if (product.image) {
                    productImage.setAttribute(
                        "src",
                        `${backend_base_url}${product.image}`
                    );
                } else {
                    productImage.setAttribute("src", "/static/img/baseimage.png");
                }

                newCard.appendChild(productImage);

                const newCardBody = document.createElement("div");
                newCardBody.setAttribute("class", "card-body");

                const productName = document.createElement("div");
                productName.setAttribute("class", "card-title product-name");
                productName.innerText = product.product;

                const inventoryStatus = document.createElement("p");
                inventoryStatus.setAttribute("class", "card-text");
                inventoryStatus.innerText = product.inventory_status;

                const price = document.createElement("p");
                price.setAttribute("class", "card-text");
                price.innerText = `₩${product.price}`;

                newCardBody.appendChild(productName);
                newCardBody.appendChild(inventoryStatus);
                newCardBody.appendChild(price);
                console.log(payload_parse)


                const addToCartButton = document.createElement("button");
                addToCartButton.style.display = "none"

                // 로그인한 사용자만 장바구니 볼 수 있게
                if (payload) {

                    addToCartButton.style.display = "block"
                    addToCartButton.setAttribute("class", "btn btn-dark");
                    addToCartButton.innerText = "장바구니에 추가";
                    addToCartButton.addEventListener("click", (event) => {
                        event.stopPropagation(); // 상위 요소로 이벤트 전파 방지
                        event.preventDefault(); // 기본 동작인 폼 제출 방지
                        addToCart(product.id);
                    });
                }

                newCardBody.appendChild(addToCartButton);
                newCard.appendChild(newCardBody);
                product_list.appendChild(newCol);
            });
        } else {
            alert("product-list 요소를 찾을 수 없습니다.")
        }
    } catch (error) {
        alert("상품 목록을 가져오는 중 오류가 발생했습니다:", error)
    }
};



// 등록된 상품을 장바구니에 추가하는 함수
async function addToCart(product) {
    console.log('product_id:', product);
    event.preventDefault()

    try {
        const response = await api.post('/carts/', {
            product: product,
            quantity: 1,
        });
        console.log(response)

        console.log('장바구니에 상품을 추가했습니다:', response.data);
        alert('장바구니에 상품을 추가했습니다.');
    } catch (error) {
        console.error('장바구니에 상품을 추가하는데 실패했습니다:', error);
        alert('장바구니에 상품을 추가하는데 실패했습니다.');
    }
}
