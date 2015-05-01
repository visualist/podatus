class LandingController < ApplicationController
  def index
    @background_text = BackgroundText::All.sample
    @books = Book.available.order(:published_year)
  end

  def about
  end
end
