const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const USERS_IN_A_PAGE = 12

const users = JSON.parse(localStorage.getItem('Favorite'))

const cardPosition = document.querySelector('.user-card')
const showModalButton = document.querySelector('.user-card-show-modal')
const searchButton = document.querySelector('#user-search-button')
const searchInput = document.querySelector('#user-search-input')
const paginator = document.querySelector('.pagination')

function renderUserCards(userArray, aimParentPosition = cardPosition) {
  let userCard = ''

  userArray.forEach(user => {
    userCard += `
      <div class="col-sm-3">
        <div class="mr-1 mt-3">
          <div class="card">
            <div class="card-header">
              <h5 class="user-card-name">${user.name}</h5>
            </div>
            <img src=${user.avatar} class="card-img-top" alt="avatar">
            <div class="row card-body justify-content-start">
              <div class="btn-group col-sm-3" role="group" aria-label="First group">
                <button type="button" class="btn btn-primary user-card-show-modal" data-toggle="modal"
                  data-target="#user-modal" data-id=${user.id}>more</button>
                <button type="button" class="btn btn-info user-card-delete" data-id=${user.id}>x</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })

  aimParentPosition.innerHTML = userCard

}

function renderPaginator(Amount) {
  const pageAmount = Math.ceil(Amount / USERS_IN_A_PAGE)
  let rawHTML = ''

  for (i = 1; i <= pageAmount; i++) {
    rawHTML += `
      <li class="page-item"><a class="page-link" data-page=${i}>${i}</a></li>
    `
  }

  paginator.innerHTML = rawHTML
}

function renderModal(id) {
  axios.get(`${INDEX_URL + id}`).then(response => {
    const userModal = document.querySelector('#user-modal')
    const data = response.data
    userModal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="user-modal-name">${data.name + ' ' + data.surname}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <img src="${data.avatar}" alt="avatar" class="image-fluid">
              </div>
              <div class="col-sm-8">
                <ul>
                  <li>Region: ${data.region}</li>
                  <li>Age: ${data.age}</li>
                  <li>Gender: ${data.gender}</li>
                  <li>Birthday: ${data.birthday}</li>
                  <li><a href="mailto:${data.email}">email: ${data.email}</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    `
  })
}

// 搜尋功能
function searchUser(keyword) {
  const userName = keyword.trim().toLowerCase()
  let usersAfterSearch = []

  usersAfterSearch = users.filter(user => user.name.toLowerCase().includes(userName))

  if (!userName) return alert('請輸入關鍵字')
  if (usersAfterSearch.length === 0) return alert('未找到使用者')

  renderUserCards(usersAfterSearch, cardPosition)
}

function getUsersArrayByPage(page) {
  let usersAfterPaginator = []
  const startIndex = (page - 1) * USERS_IN_A_PAGE
  const deleteCount = page * USERS_IN_A_PAGE
  usersAfterPaginator = users.slice(startIndex, deleteCount)

  return usersAfterPaginator
}

function removeFavoriteFromLocalStorage(id) {
  const deleteIndex = users.findIndex(user => user.id === Number(id))
  users.splice(deleteIndex, 1)

  localStorage.setItem('Favorite', JSON.stringify(users))
  renderUserCards(users)
}


// more button、delete card function
cardPosition.addEventListener('click', function MoreButtonOnClick(event) {
  if (event.target.matches('.user-card-show-modal')) {
    renderModal(event.target.dataset.id)
  } else if (event.target.matches('.user-card-delete')) {
    const userID = event.target.dataset.id
    removeFavoriteFromLocalStorage(userID)
  }

})



// 渲染最愛使用者卡片
renderUserCards(users)