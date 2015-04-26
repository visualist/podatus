class ChaptersController < ApplicationController

  def index
    @book_id = params[:book_id]
    @book = Book.find(@book_id)
    @chapters = @book.chapters
    respond_to do |format|
      format.html
      format.json { render json: @chapters }
    end
  end

  def show
    @book_id = params[:book_id]
    @book = Book.find(@book_id)
    @chap_id = params[:id]
    respond_to do |format|
      format.html
      format.json { render json: @book }
    end
  end

end
