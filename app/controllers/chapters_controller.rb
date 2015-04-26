class ChaptersController < ApplicationController
  def index
    @background_text = BackgroundText::All.sample
    @books = Book.all.order(:published_year)
  end

  def show
    @id = params[:id]
    @book = Book.find(@id)
  end
end
