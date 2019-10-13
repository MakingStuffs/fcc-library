$( document ).ready(function() {
  var items = [];
  var itemsRaw = [];
  
  $.getJSON('/api/books', function(data) {
    //var items = [];
    itemsRaw = data;
    console.log(itemsRaw);
    $.each(data, function(i, val) {
      items.push(`<div class="bookRow"><li class="bookItem" id="${i}">${val.title}</li><span class="commentCount">${val.commentcount} comments</span></div>`);
      return ( i !== 14 );
    });
    if (items.length >= 15) {
      items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    }
    $('<ul/>', {
      'class': 'listWrapper',
      html: items.join('')
      }).appendTo('#display');
  });
  const clickHandler = (elem) => {
    $("#detailTitle").html(`<div class="detailLink"><a href="./api/books/${itemsRaw[elem.id]._id}"><b>${itemsRaw[elem.id].title}</b> (id: ${itemsRaw[elem.id]._id})</a></div>`);
    $.getJSON('/api/books/'+itemsRaw[elem.id]._id, function(data) {
      comments = [];
      $.each(data.comments, function(i, val) {
        comments.push(`<li class="comment">"${val.comment}"<br /><p class="author">- ${val.commenter}</p></li>`);
        console.log(val);
      });
      comments.push('<form id="newCommentForm"><label for="commentToAdd">Add Comment</label><input type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment">');
      comments.push('<label for="quickCommenter">Your Name</label><input id="quickCommenter" type="text" class="form-control" name="commenter" placeholder="Internet User"></form>');
      comments.push('<button class="btn btn-info addComment" id="'+ data._id+'">Add Comment</button>');
      comments.push('<button class="btn btn-danger delete deleteBook" id="'+ data._id+'">Delete Book</button>');
      document.getElementById('detailComments').style.display = 'block';
      $('#detailComments').html(comments.join(''));
    });
  }
  var comments = [];
  $('#display').on('click','li.bookItem',function() {
    return clickHandler(this);
  });
  
  $('#bookDetail').on('click','button.deleteBook',function() {
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'delete',
      success: function(data) {
        $('#detailComments').html('<p class="deleteResponse">'+data.success+'<p><button id="refreshPage">Refresh the page</button>');
        $('#refreshPage').on('click', function() {
          return location.reload()                     
        });
      }
    });
  });  
  
  $('#bookDetail').on('click','button.addComment',function() {
    var newComment = `<li class="comment">"${document.querySelector('#commentToAdd').value}"<br /><p class="author">- ${document.querySelector('#quickCommenter').value === "" ? "Anonymous" : document.querySelector('#quickCommenter').value}</p></li>`;
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        comments.unshift(newComment); //adds new comment to top of list
        $('#detailComments').html(comments.join(''));
      }
    });
  });
  
  $('#newBook').click(function(e) {
    e.preventDefault();
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        itemsRaw.push(data);
        let allBooks = document.querySelectorAll('.bookRow');
        let newBook = `<div class="bookRow"><li class="bookItem" id="${allBooks.length}">${data.title}</li><span class="commentCount">${data.commentcount} comments</span></div>`;
        document.querySelector('ul.listWrapper').innerHTML += newBook;
        document.getElementById(allBooks.length).addEventListener('click', function() {
          return clickHandler(this);
        })
      }
    });
  });
  
  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
  }); 
  
});