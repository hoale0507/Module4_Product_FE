function showAllProduct(page){
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products?page=${page}`,
        success: function (data){
            let products = data.content;
            let content = "";
            for (let i = 0; i < products.length; i++) {
                content += ` <tr>
        <th scope="row">${i + 1}</th>
        <td>${products[i].name}</td>
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
            for (let i = 0; i < data.totalPages; i++) {
                contentForPaging += `<li class="page-item"><button class="page-link" onclick="showAllProduct(${i})">${i+1}</button></li>`
            }
            $('#paging').html(contentForPaging);
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
        data: product,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (){
            showAllProduct();
            showSuccessMessage('Create completed');
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
        success: function (){
            showAllProduct();
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
                <button type="button" class="btn btn-primary" onclick="editProduct(${id})">Edit</button>`;
            $('#edit-modal-footer').html(content1);
        }
    })
}


function editProduct(id){
    let name = $('#nameEdit').val();
    let price = $('#priceEdit').val();
    let description = $('#descriptionEdit').val();
    let image = $('#imageEdit');
    let category = $('#categoryEdit').val();
    let product = new FormData();
    product.append('name',name);
    product.append('description',description);
    product.append('price',price);
    product.append('category',category);
    product.append('image',image.prop('files')[0]);
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/products/${id}`,
        data: product,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (){
            showSuccessMessage('Edit successfully!');
            showAllProduct();
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