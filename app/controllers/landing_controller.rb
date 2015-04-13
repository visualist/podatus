class LandingController < ApplicationController
  def index
    @background_text = BackgroundText::All.sample
    @books = Book.all.order(:published_year)
  end

  def about
  end
end
