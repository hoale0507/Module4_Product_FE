let currentUser = localStorage.getItem('currentUser'); // lay ra chuoi token
currentUser = JSON.parse(currentUser); // chuyen token thanh json
function showAllProduct(page){
    let query = $('#search').val();
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products?page=${page}&q=${query}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data){
            let products = data.content;
            let content = "";
            let currentPage = data.number;
            for (let i = 0; i < products.length; i++) {
                content += ` <tr>
        <th scope="row">${ (currentPage+1) * 3-(2-i)}</th>
        <td><a id="view-product" href="#" onclick="showProductDetails(${products[i].id})">${products[i].name}</a></td>
        <td>${products[i].price}</td>
        <td>${products[i].description}</td>
        <td>${products[i].category == null ? "" : products[i].category.name}</td>
        <td><img src="http://localhost:8080/image/${products[i].image}" alt="img"></td>
        <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#edit-product" onclick="showEditForm(${products[i].id})"><i class="fa fa-edit"></i></button></td>
        <td><button type="button" class="btn btn-danger" data-toggle="modal" data-target="#delete-product" onclick="showDeleteForm(${products[i].id})"><i class="fa fa-trash"></i></button>
    </tr>`;
            }
            $('#product-list-content').html(content);

            let contentForPaging = "";
            if(!data.first){
                contentForPaging = ` <li class="page-item"><button class="page-link" onclick="showAllProduct(${currentPage-1})">&laquo;</button></li>`;
            }

            for (let i = 0; i < data.totalPages; i++) {
                contentForPaging += `<li class="page-item"><button class="page-link" onclick="showAllProduct(${i})">${i+1}</button></li>`
            }
            if(!data.last){
                contentForPaging += `<li class="page-item"><button class="page-link" href="#" onclick="showAllProduct(data.number+1)">&raquo;</button></li>`;
            }
            $('#paging').html(contentForPaging);
            $('#currentPage').html(`Current Page: ${currentPage+1}/${data.totalPages}`);
        }
    })
}


function createNewProduct(){
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let image = $('#image');
    let category = $('#category').val();
    let product = new FormData();
    product.append('name',name);
    product.append('description',description);
    product.append('price',price);
    product.append('category',category);
    product.append('image',image.prop('files')[0]);
    $.ajax({
        type: 'POST',
        url: "http://localhost:8080/products",
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        data: product,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (){
            showAllProduct(0);
            showSuccessMessage('Create completed');
            $('#name').val(null);
            $('#price').val(null);
            $('#description').val(null);
            $('#image').val(null);
        },
        error: function (){
            showErrorMessage('Created failed');
        }
    })
}

$(document).ready(function () {
    showAllProduct(0);
})


function deleteProduct(id){
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/products/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (){
            showAllProduct(0);
            showSuccessMessage('Deleted completed');
        },
        error: function (){
            showErrorMessage('Deleted failed');
        }
    })
}

function showDeleteForm(id){
    let content = `
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" onclick="deleteProduct(${id})" data-dismiss="modal">Delete</button>`;
    $('#delete-form-footer').html(content);
}

function showEditForm(id){
    $.ajax({
        type:'GET',
        url:`http://localhost:8080/products/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (product){
            $('#nameEdit').val(product.name);
            $('#priceEdit').val(product.price);
            $('#descriptionEdit').val(product.description);
            // $('#imageEdit').val(product.image);
            $('#oldImage').html(`<img src="http://localhost:8080/image/${product.image}" alt="img">`)
            $.ajax({
                type:'GET',
                url: 'http://localhost:8080/categories',
                success: function (data){
                    let content =  `
                        <option>Select category</option>`;
                    for (let category of data) {
                        if(product.category.id == category.id){
                            content += `
                        <option value="${category.id}" selected>${category.name}</option>`;
                        } else{
                            content += `
                        <option value="${category.id}">${category.name}</option>`;}
                    }
                    $('#categoryEdit').html(content);
                }
            })
            let content1 = `
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="editProduct(${id})" data-dismiss="modal">Edit</button>`;
            $('#edit-modal-footer').html(content1);
        }
    })
}


function editProduct(id){
    let name = $('#nameEdit').val();
    let price = $('#priceEdit').val();
    let description = $('#descriptionEdit').val();
    let category = $('#categoryEdit').val();
    let product = new FormData();

    let files = $('#imageEdit').prop('files');

    if (files.length != 0) {
        let image = files[0];
        product.append('image',image);
    }

    product.append('name',name);
    product.append('description',description);
    product.append('price',price);
    product.append('category',category);
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/products/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        data: product,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (){
            showSuccessMessage('Edit successfully!');
            showAllProduct(0);
            $('#imageEdit').val(null);
        },
        error: function (){
            showErrorMessage('Edit failed!');
        }
    })
}


function showCategoryList(){
    $.ajax({
        type:'GET',
        url: 'http://localhost:8080/categories',
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data){
            let content =  `
                        <option>Select category</option>`;
            for (let category of data) {
                content += `
                        <option value="${category.id}">${category.name}</option>`;
            }
            $('#category').html(content);
        }
    })
}

$('#view-product').on('click',function (){
    $.ajax({
        type: 'GET',
        url: "http://localhost:8080/"
    })
})

function showProductDetails(id){
    $.ajax({
        type:'GET',
        url: `http://localhost:8080/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data){
            let content = "<a href='ProductFE/pages/product/product.html'>Back to Product List</a>";
            content += `<div>
<table>
<tr>
<td>Name</td>
<td>${data.name}</td>
</tr>
<tr>
<td>Price</td>
<td>${data.price}</td>
</tr>
<tr>
<td>Description</td>
<td>${data.description}</td>
</tr>
</table>
<p><img src="/image/${data.image}" alt="img"></p>
</div>`;
            $('#main-content').html(content);
        }
    })
}