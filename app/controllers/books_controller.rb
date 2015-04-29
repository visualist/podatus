class BooksController < ApplicationController
  def index
    @background_text = BackgroundText::All.sample
    @books = Book.all.order(:published_year)
    respond_to do |format|
      format.html
      format.json { render json: @books }
    end
  end

  def show
    @id = params[:id]
    @book = Book.find(@id)
    @random_chapter_id = @book.chapters.sample
    respond_to do |format|
      format.html
      format.json { render json: @book.as_json(:methods => :chapters) }
    end
  end
end
