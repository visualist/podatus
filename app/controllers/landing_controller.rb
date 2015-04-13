class LandingController < ApplicationController
  def index
    #@sitename = 'name'
    @books = Book.all.order(:published_year)
  end

  def about
  end
end
