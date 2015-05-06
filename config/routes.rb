Rails.application.routes.draw do
  get 'landing/index'
  get 'landing/about'
  get 'about' => 'landing#about'

  get 'book/:book_id/sentence/:id' => 'chapters#sentence'

# get 'books' => 'books#index'
# get 'books/:id' => 'books#show', as: 'onebook'
# get 'book/:id' => 'books#show', as: 'book'

  resources :book, controller: 'books', only: [:index, :show] do
    resources :chapter, controller: 'chapters', :path => '/chapter', only: [:index, :show]
  end

  resources :books, only: [:index, :show] do
    resources :chapter, controller: 'chapters',
                        path: '/chapter',
                        only: [:index, :show],
                        defaults: { :format => :json }
  end

  root 'landing#index'
end
